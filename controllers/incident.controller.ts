import { Request, Response } from "express";
import Incident from "../models/incident.model";
import axios from "axios";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

export const createIncident = async (req: Request, res: Response) => {
  try {
    const { incident_desc, city, country } = req.body;

    // fetch weather data from openweathermap api
    const {
      data: { weather, main },
    } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );

    const mergedData = {
      ...main,
      weather: [...weather],
    };

    const incident = await Incident.create({
      incident_desc,
      city,
      country,
      date: new Date(),
      weather_report: mergedData,
    });

    res.status(201).json(incident);
  } catch (error: any) {
    if (error instanceof BadRequestError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// GET /incidents?city=accra&temp_min=300&temp_max=310&humidity_min=60&humidity_max=80
export async function getIncidents(req: Request, res: Response) {
  try {
    const { city, temp_min, temp_max, humidity_min, humidity_max } = req.query;

    // build where clause based on filters
    const where: any = {};
    if (city) {
      where["city"] = city;
    }
    if (temp_min && temp_max) {
      where["weather_report.temp"] = {
        [Op.between]: [Number(temp_min), Number(temp_max)],
      };
    } else if (temp_min) {
      where["weather_report.temp"] = {
        [Op.gte]: Number(temp_min),
      };
    } else if (temp_max) {
      where["weather_report.temp"] = {
        [Op.lte]: Number(temp_max),
      };
    }
    if (humidity_min && humidity_max) {
      where["weather_report.humidity"] = {
        [Op.between]: [Number(humidity_min), Number(humidity_max)],
      };
    } else if (humidity_min) {
      where["weather_report.humidity"] = {
        [Op.gte]: Number(humidity_min),
      };
    } else if (humidity_max) {
      where["weather_report.humidity"] = {
        [Op.lte]: Number(humidity_max),
      };
    }

    // get all incidents matching the where clause
    const incidents = await Incident.findAll({ where });

    res.json(incidents);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export const getIncidentsByCountry = async (req: Request, res: Response) => {
  const { country } = req.body;

  try {
    const incidents = await Incident.findAll({ where: { country } });
    res.status(200).json(incidents);
  } catch (error: any) {
    if (error instanceof BadRequestError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

class BadRequestError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
  }
}
