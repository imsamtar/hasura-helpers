function capitalize(str) {
    return str.replace(/^./, (value) => value.toUpperCase());
}
function space(n) {
    let r = '';
    for (let i = 0; i < n; i++) {
        r += ' ';
    }
    return r;
}
function objToStr(obj) {
    obj = JSON.stringify(obj).replace(/{\"/g, '{').replace(/\":/g, ':').replace(/,\"/g, ',');
    obj = obj.replace(/{/g, '{ ');
    obj = obj.replace(/:/g, ': ');
    obj = obj.replace(/,/g, ', ');
    obj = obj.replace(/}/g, ' }');
    return obj;
}

class Query {
    constructor(operation, table, schema = '') {
        this.op = operation;
        this.table = table;
        this.schema = schema === "public" ? '' : schema;
        this.queryParams = [];
        this.preName = this.postName = '';
        this.single = this.op === "select";
    }
    get name() {
        return `${this.op === 'select' ? '' : `${this.op}_`}${this.schema ? `${this.schema}_` : ''}${this.table}`;
    }
    param(key, value) {
        if (key && value)
            this.queryParams.push(`${key}: ${objToStr(value)}`);
        else if (!value && typeof key === "object") {
            value = key;
            for (const [key, val] of Object.entries(value)) {
                this.queryParams.push(`${key}: ${objToStr(val)}`);
            }
        }
        return this;
    }
    pk(pk) {
        this.postName = 'by_pk'
        this.param(pk);
        return this;
    }
    where(where) {
        this.param('where', where);
        return this;
    }
    objects(objects) {
        this.single = false;
        if (this.op === 'insert')
            this.param('objects', objects);
        return this;
    }
    object(object) {
        this.single = true;
        if (this.op === 'insert') {
            this.postName += 'one';
            this.param('object', object);
        }
        return this;
    }
    affected_rows() {
        if (this.op !== "select")
            this.affected = true;
        return this;
    }
    get(items = []) {
        let result = `${this.op !== "select" ? 'mutation' : 'query'} ${this.op}${capitalize(this.table)} {
    ${this.name}${this.postName ? `_${this.postName}` : ''}${this.queryParams.length ? `(${this.queryParams})` : ''} {
${this.single ? '' : `${space(8)}returning {\n`}${items.reduce((result, item) => result + `${space(this.single ? 8 : 12)}${item}\n`, '')}${this.single ? '' : `${space(8)}}\n`}
        ${this.affected && !this.single ? 'affected_rows' : ''}
    }
} `;
        result = result.replace(/\n\s*\n/g, '\n');
        return result;
    }
}

module.exports = Query;
