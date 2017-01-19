#!/usr/bin/env python

from sanic import Sanic
from sanic.response import json as sjson, text, html, file, redirect
import requests
import time
import uuid
import json
import os
from aoiklivereload import LiveReloader
import random
from sanic_cors import CORS, cross_origin


app = Sanic(__name__)

CORS(app)

proxies = {
    "http": os.environ['QUOTAGUARDSTATIC_URL'],
    "https": os.environ['QUOTAGUARDSTATIC_URL']
}

# Create reloader
reloader = LiveReloader()

# Start watcher thread
reloader.start_watcher_thread()

tokens = [
    "68d01249033019e2e2469561d6571b80",
    "86263db10d2290c1e82306911fb87100"
]


app.static('/', './dist')


@app.route('/')
def handle_request(request):
    return redirect('/index.html')


@app.route("/api/v1/fare_estimate", methods=['POST', 'OPTIONS'])
async def test(request):
    if request.method == "OPTIONS":
        return text("ok")
    payload = request.json
    print(payload)
    if "origin" not in payload:
        return HTTPResponse("Missing trip origin", status=400)
    if "destination" not in payload:
        return HTTPResponse("Missing trip destination", status=400)
    if all([all(["lat", "lon"]) in payload[k] for k in payload.keys()]):
        return HTTPResponse("Missing lat/lon", status=400)

    origin = payload["origin"]
    destination = payload["destination"]

    print(origin)
    print(destination)

    url = 'https://cn-geo1.uber.com/rt/riders/me/fare-estimate'
    device_id = str(uuid.uuid4()).upper()
    headers = {
        'host': 'cn-geo1.uber.com',
        'Connection': 'keep-alive',
        'x-uber-device-epoch': '%.2f' % time.time(),
        'x-uber-device-location-latitude': '37.76345',
        'x-uber-request-uuid': str(uuid.uuid4()).upper(),
        'x-uber-client-session': str(uuid.uuid4()).upper(),
        'x-uber-client-name': 'client',
        'x-uber-device-id-tracking-enabled': '1',
        'X-Uber-RedirectCount': '0',
        'x-uber-device-os': '8.2',
        'x-uber-token': random.choice(tokens),
        'x-uber-device': 'iphone',
        'x-uber-device-ids': 'aaid:' + device_id,
        'Accept-Encoding': 'gzip, deflate',
        'Proxy-Connection': 'keep-alive',
        'x-uber-device-location-longitude': '-122.43649',
        'Accept-Language': 'en;q=1',
        'x-uber-device-language': 'en',
        'x-uber-client-id': 'com.ubercab.UberClient',
        'x-uber-device-h-accuracy': '200.00000',
        'User-Agent': '/iphone/3.225.3',
        'x-uber-device-model': 'iPhone4,1',
        'Accept': '*/*',
        'x-uber-device-v-accuracy': '12.27833',
        'x-uber-client-version': '3.225.3',
        'x-uber-device-id': device_id,
        'Content-Type': 'application/json',
        'Content-Length': '1750',
        'x-uber-device-location-altitude': '195.99226',
    }

    data = {
        "destination": {
            "addressComponents": [],
            "address_components": [],
            "components": [],
            "latitude": destination["lat"],
            "longitude": destination["lon"],
            "translations": {}
        },
        "isScheduledRide": None,
        "pickupLocation": {
            "addressComponents": [],
            "address_components": [],
            "components": [],
            "latitude": origin["lat"],
            "longitude": origin["lon"],
            "translations": {}
        },
        "userExperiments": [
            {
                "group": "master",
                "name": "beehive_upfront_pricing_v2"
            }
        ],
        "vehicleViewIds": [],
        "version": "1.0.0"
    }

    r = requests.post(
        url=url,
        headers=headers,
        data=json.dumps(data),
        proxies=proxies
    )

    print(r.text)

    fare_infos = [v for v in r.json()["packageVariants"]
                  if "fareInfo" in v["pricingInfo"]]

    print(fare_infos)

    data = {
        "deviceParameters": {
            "mcc": "310",
            "mnc": "VZW"
        },
        "launchParameters": {},
        "requestPickupLocation": {
            "locationSource": "DefaultDevice",
            "targetLocation": {
                "latitude": origin["lat"],
                "longitude": origin["lon"]
            }
        }
    }

    r = requests.post('https://cn-geo1.uber.com/rt/riders/me/app-launch',
                      headers=headers, data=json.dumps(data), proxies=proxies)

    vehicleviews = {int(k): {"name": v["displayName"], "image": v["productImage"][
        "url"] if "productImage" in v else None} for k, v in r.json()["city"]["vehicleViews"].items()}

    print(vehicleviews)

    # viewid_to_product = {
    #     4651: "ASSIST",
    #     2930: "SELECT",
    #     1930: "WAV",
    #     942: "uberXL",
    #     8: "uberX",
    #     2: "SUV",
    #     1: "BLACK",
    #     1491: "POOL"
    # }

    variants = [{"price": float(f["pricingInfo"]["fareInfo"]["upfrontFare"]["fare"]), "surge": f["pricingInfo"]["fareInfo"]["upfrontFare"][
        "surgeMultiplier"], "key": f["pricingInfo"]["packageVariantUuid"], "product": vehicleviews[f["vehicleViewId"]]["name"],
        "image": vehicleviews[f["vehicleViewId"]]["image"]} for f in fare_infos]

    return sjson(sorted(variants, key=lambda x: x["price"]))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))
