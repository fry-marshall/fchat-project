import { ModelStatic, ValidationError } from "sequelize";
import Helpers from "../../helpers/helpers";


export default class Service {

    protected model: ModelStatic<any>

    constructor(model: ModelStatic<any>){
        this.model = model;
    }

    async getAll(){
        try{
            const data = await this.model.findAll()
            return Helpers.queryResponse(data)
        } catch(err){
            return Helpers.serverError
        }
    }

    async insert(data: any){
        try{
            const item = await this.model.create(data)
            return Helpers.queryResponse(item)
        } catch(error){
            if(error instanceof ValidationError){
                let fields = []
                for(let err of error.errors){
                    fields.push({name: err.path, status: err.validatorKey})
                }
                return Helpers.queryError({msg: 'fields errors', fields})
            }
            return Helpers.serverError
        }
    }

    async update(id: string, data: any){
        try{
            let item = await this.model.findByPk(id);
            if (!item) {
                return Helpers.notFoundError
            }
            item.set(data)
            await item.save()
            return Helpers.queryResponse(item)
        } catch(err){
            if(err instanceof ValidationError){
                let fields = []
                for(let error of err.errors){
                    fields.push({name: error.path, status: error.validatorKey})
                }
                return Helpers.queryError({msg: 'fields errors', fields})
            }
            return Helpers.serverError
        }
    }

    async delete(id: string) {
        try {
            const item = await this.model.findByPk(id);
            if (!item){
                return Helpers.notFoundError;
            }
            await item.destroy()
            return Helpers.queryResponse(item)
        } catch (error) {
            return Helpers.serverError
        }
    }

}
