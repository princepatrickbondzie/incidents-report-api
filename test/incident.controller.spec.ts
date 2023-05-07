import { expect } from "chai";
import { Request, Response } from "express";
import {
  createIncident,
  getIncidentsByCountry,
  getIncidents,
} from "../controllers/incident.controller";
import Incident from "../models/incident.model";
import sinon from "sinon";
import { Op } from "sequelize";

class MockResponse {
  statusCode: number = 200;
  json(data: any): void {
    return;
  }
  status(statusCode: number): this {
    this.statusCode = statusCode;
    return this;
  }
}

describe("Incidents Controller", () => {
  describe("createIncident", () => {
    it("should create a new incident", async () => {
      const mockReq = {
        body: {
          incident_desc: "Rain",
          city: "Tema",
          country: "Ghana",
        },
      } as Request;

      const mockRes = new MockResponse() as Response;
      await createIncident(mockReq, mockRes);

      expect(mockRes.statusCode).to.equal(201);
    });

    it("should return a 500 status code if an error occurs", async () => {
      const mockReq = {
        body: {},
      } as Request;

      const mockRes = new MockResponse() as Response;
      await createIncident(mockReq, mockRes);
      console.log("mockRes::", mockRes);
      expect(mockRes.statusCode).to.equal(500);
    });
  });

  describe("getIncidents", () => {
    it("should return all incidents", async () => {
      const req = { query: {} } as Request;

      const mockRes = new MockResponse() as Response;

      await getIncidents(req, mockRes);
      expect(mockRes.statusCode).to.equal(200);
    });

    it("should filter incidents by city, temp range, and humidity range", async () => {
      const req = {
        query: {
          city: "Accra",
          temp_min: "25",
          temp_max: "30",
          humidity_min: "50",
          humidity_max: "60",
        },
      } as unknown as Request;
      const mockIncidents = [
        { id: 1, city: "Accra", weather_report: { temp: 25, humidity: 50 } },
        { id: 3, city: "Accra", weather_report: { temp: 28, humidity: 60 } },
      ] as unknown as Incident[];
      const findAllStub = sinon
        .stub(Incident, "findAll")
        .resolves(mockIncidents);
      const mockRes = { json: sinon.spy() } as unknown as Response;

      await getIncidents(req, mockRes);

      expect(findAllStub.calledOnce).to.be.true;
      expect(
        findAllStub.calledWith({
          where: {
            city: "Accra",
            "weather_report.temp": { [Op.between]: [25, 30] },
            "weather_report.humidity": { [Op.between]: [50, 60] },
          },
        })
      ).to.be.true;
    });

    // it("should handle errors", async () => {
    //   const req = { query: {} } as Request;
    //   const findAllStub = sinon
    //     .stub(Incident, "findAll")
    //     .rejects(new Error("Database error"));
    //   const mockRes = {
    //     status: sinon.stub().returnsThis(),
    //     json: sinon.spy(),
    //   } as unknown as Response;

    //   await getIncidents(req, mockRes);

    //   expect(findAllStub.calledOnce).to.be.true;
    // });
  });

  describe("getIncidentsByCountry", () => {
    it("should get all incidents for a given country", async () => {
      const mockReq = {
        body: {
          country: "Ghana",
        },
      } as Request;

      const mockRes = new MockResponse() as Response;
      await getIncidentsByCountry(mockReq, mockRes);

      expect(mockRes.statusCode).to.equal(200);
    });

    // it("should return a 500 status code if an error occurs", async () => {
    //   const mockReq = {
    //     body: {},
    //   } as Request;

    //   const mockRes = new MockResponse() as Response;

    //   await getIncidentsByCountry(mockReq, mockRes);

    //   expect(mockRes.statusCode).to.equal(500);
    // });
  });
});
