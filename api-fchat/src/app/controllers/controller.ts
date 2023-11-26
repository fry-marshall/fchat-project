import Service from "../services/service";
import { Request, Response } from "express";

export default class Controller {

    protected service: Service

    constructor(service: Service) {
      this.service = service;
      this.getAll = this.getAll.bind(this);
      this.insert = this.insert.bind(this);
      this.update = this.update.bind(this);
      this.delete = this.delete.bind(this);
    }
  
    async getAll(req: Request, res: Response) {
        const response = await this.service.getAll()
        if(response.is_error){
            return res.status(500).json(response)
        }
        return res.status(200).json(response)
    }
  
    async insert(req: Request, res: Response) {
      const response = await this.service.insert(req.body);
      if (response.is_error){
        return res.status(400).json(response);
      }
      return res.status(201).json(response);
    }
  
    async update(req: Request, res: Response) {
      const { id } = req.body;
      const response = await this.service.update(id, req.body);
      if (response.is_error){
        return res.status(400).send(response);
      }
      return res.status(202).send(response);
    }
  
    async delete(req: Request, res: Response) {
      const { id } = req.body;
      const response = await this.service.delete(id);
      if (response.is_error){
        return res.status(500).send(response);
      }
      return res.status(202).send(response);
    }
  
}
