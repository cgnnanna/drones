# Drones

---

## Introduction

There is a major new technology that is destined to be a disruptive force in the field of transportation: **the drone**. Just as the mobile phone allowed developing countries to leapfrog older technologies for personal communication, the drone has the potential to leapfrog traditional transportation infrastructure.

Useful drone functions include delivery of small items that are (urgently) needed in locations with difficult access.

---

### Running the solution

After cloning the app, run

```bash
npm install
```

When the process completes, start the app by running

```bash
npm start
```

in order to easily test the API, use the postman collection <https://www.getpostman.com/collections/1cec76ae6b6ee49d58de>

## API Documentation

### Register Drone

 An endpoint to register a new drone.

#### **Path**

```bash
POST /drone/register
```

#### **Request**

| Parameter    | Description                                                                                    | Mandatory | Type    |
|--------------|------------------------------------------------------------------------------------------------|-----------|---------|
| serialNum    | A unique identifier for the drone                                                              | True      | String  |
| model        | The model of the drone. Could be one of  Lightweight, Middleweight, Cruiserweight, Heavyweight.| True      | String  |
| batteryLevel | The battery level of the drone in percentage..                                                   | True      | Integer |

### Get Available Drones

An endpoint to get all drones in idle state.

#### **Path**

```bash
GET /drone
```

#### **Request**

No request parameters.

### Get Drone Battery Level

 An endpoint to get a drone's battery level.

#### **Path**

```bash
GET /drone/batteryLevel/:serialNum
```

#### **Request**

| Parameter    | Description                                                                                    | Mandatory | Type    |
|--------------|------------------------------------------------------------------------------------------------|-----------|---------|
| serialNum    | The serialNum of the drone.                                                            | True      | String  |

### Load Medication on Drone

 An endpoint to load medication on drone.

#### **Path**

```bash
POST /med/load/:serialNum
```

#### **Request**

| Parameter | Description                                                     | Mandatory | Type    |
|-----------|-----------------------------------------------------------------|-----------|---------|
| serialNum | The serialNum of the drone to load medications on | True      | String  |
| name      | name of the medication to be loaded                             | True      | String  |
| weight    | weight of the medication                                        | True      | Integer |
| code      | A code to identify the medication                              | True      | String  |
| image     | image of the medication to be loaded                            | True      | File    |

### Get Loaded Medication

 An endpoint to get all loaded medications on a drone.

#### **Path**

```bash
GET /med/fetch/:serialNum
```

#### **Request**

| Parameter    | Description                                                                                    | Mandatory | Type    |
|--------------|------------------------------------------------------------------------------------------------|-----------|---------|
| serialNum    | The serialNum of the drone.                                                              | True      | String  |

### Deliver Loaded Medication

 An endpoint to deliver all loaded medications to a destination. For the sake of this exercise, the delivery and return time is fixed to 10s each(configurable through the .env).
 \
 Once the delivery is complete, the loaded medication(s) on the drone is cleared and the drone is set for next delivery once it's returned.

#### **Path**

```bash
POST /drone/deliver/:serialNum
```

#### **Request**

| Parameter    | Description                                                                                    | Mandatory | Type    |
|--------------|------------------------------------------------------------------------------------------------|-----------|---------|
| serialNum    | The serialNum of the drone, specified as a path parameter of the endpoint.                                                              | True      | String  |
| deliveryAddress   | Address to deliver loaded medication(s), specified as a body parameter of the request.                                                            | True      | String  |

### Return Drone

 An endpoint to return drone after delivering loaded medications.

#### **Path**

```bash
GET /drone/return/:serialNum
```

#### **Request**

| Parameter    | Description                                                                                    | Mandatory | Type    |
|--------------|------------------------------------------------------------------------------------------------|-----------|---------|
| serialNum    | The serialNum of the drone.                                                              | True      | String  |

### Charge Drone

 An endpoint to charge drone. The drone will discharge each time it goes out for delivery and also when returning from the delivery. For the sake of this exercise, the discharge factor used is 0.001 per gram per second.

#### **Path**

```bash
POST /drone/charge
```

#### **Request**

| Parameter    | Description                                                                                    | Mandatory | Type    |
|--------------|------------------------------------------------------------------------------------------------|-----------|---------|
| serialNum    | The serialNum of the drone.                                                              | True      | String  |
| batteryInput   | A number that specifies the amount of charge to add to the drone's battery level.                                                           | True      | Integer  |

### Get Audit Report

 An endpoint to get audit report for  battery level

#### **Path**

```bash
GET /audit/battery
```

#### **Request**

No request parameters.