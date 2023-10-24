'use strict';

class Collection {
    constructor(model) {
        this.model = model;
    }

    async create(json) {
        try {
            const record = await this.model.create(json);
            return record;
        } catch (e) {
            console.error('error in the collection interface', e);
        }
    }

    async read(id, options = {}) {
        try {
            let record = null;
            if (id) {
                options.where = { ...options.where, id: id }; // Merge the provided where clause with the id
                record = await this.model.findOne(options);
            } else {
                record = await this.model.findAll(options);
            }
            return record;
        } catch (e) {
            console.error('Error with read method in Collection class:', e);
            throw new Error(e.message);
        }
    }
    

    async update(id, json) {
        try {
            const recordToUpdate = await this.model.findByPk(id);
            if (recordToUpdate) {
                await recordToUpdate.update(json);
                return recordToUpdate; // Return the updated record
            } else {
                throw new Error('Record not found');
            }
        } catch (e) {
            console.error('error in the collection interface');
            return e;
        }
    }

    async delete(id) {
        try {
            const result = await this.model.destroy({
                where: {
                    id: id
                }
            });
            if (result) {
                return { message: 'Record deleted successfully' }; 
            } else {
                throw new Error('Record not found or not deleted');
            }
        } catch (e) {
            console.error('error in the collection interface');
            return e;
        }
    }
}

module.exports = Collection;
