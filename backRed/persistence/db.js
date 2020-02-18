var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var nameDataBase = "RedSocial"
var collectionPerson = 'persons'
var collectionPublictions = 'publications'
    /********************** GET *****************************/
exports.getperson = function(req, res) {
    select(req.body, collectionPerson, (documentos) => {
        res.send(documentos);
    })
}

exports.getpublications = function(req, res) {
    select(req.body, collectionPublictions, (documentos) => {
        if (documentos === undefined || documentos.length == 0) {
            valueSend(res, 400, "error", "Ups ocurrio un error")
        } else {
            valueSend(res, 200, "OK", documentos)
        }
    })
}


exports.getpublicationsName = function(req, res) {
        select("{},{ public_title:1}", collectionPublictions, (documentos) => {
            res.send(documentos);
        })
    }
    /********************** POST *****************************/
exports.postPerson = function(req, res) {
    console.log(req.body)
    insert(req.body, collectionPerson, (documentos) => {
        res.send(documentos);
    });
}

exports.login = function(req, res) {
    select(req.body, collectionPerson, (documentos) => {
        if (documentos === undefined || documentos.length == 0) {
            valueSend(res, 400, "error", "")
        } else {
            valueSend(res, 200, "OK", documentos)
        }
    });
}

function valueSend(res, status, message, value) {
    res.send(JSON.stringify({
        "responseCode": status,
        "message": message,
        "object": value
    }));
}

exports.postBlogs = function(req, res) {
    insert(req.body, 'blogs', (documentos) => {
        res.send(documentos);
    });
}

exports.postComments = function(req, res) {
    insert(req.body, 'comments', (documentos) => {
        res.send(documentos);
    });
}

exports.postPublications = function(req, res) {
    console.log(req.body)
    insert(req.body, collectionPublictions, (documentos) => {
        valueSend(res, 200, "OK", documentos)
    });
}

/********************** REMOVE *****************************/
exports.removePerson = function(req, res) {
    var id_person = parseInt(req.params.id_person);
    remove({ "id_person": id_person }, collectionPerson, (documentos) => {
        res.send(documentos);
    });
}


/********************** UPDATE *****************************/
exports.UpdatePerson = function(req, res) {
    Update({ "id_person": req.body.id_person }, req.body, collectionPerson, (documentos) => {
        res.send(documentos);
    });
}

function select(query, collection, callback) {
    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db(nameDataBase); //here
        selectData(query, collection, dbase, callback)
    });
}

const selectData = async function(query, col, db, callback) {
    const collection = db.collection(col);
    collection.find(query).project({ _id: 0 }).toArray(function(err, docs) {
        console.log(docs)
        callback(docs)
    });
}

function insert(query, collection, callback) {
    mongoClient.connect(url, { useNewUrlParser: true }, { useUnifiedTopology: true }, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db(nameDataBase); //here
        insertData(query, collection, dbase, callback)
    });
}

const insertData = async function(query, col, db, callback) {
    const collection = db.collection(col);
    try {
        collection.insertOne(query);
        callback({ "status": 200, "message": "guardado exitoso" });
    } catch (error) {
        callback({ "status": 400, "message": "upsss, ocurrio un error" });
    }
}

function remove(query, collection, callback) {
    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db(nameDataBase); //here
        removeData(query, collection, dbase, callback)
    });
}

const removeData = async function(query, col, db, callback) {
    const collection = db.collection(col);
    try {
        collection.deleteOne(query);
        callback({ "status": 200, "message": "eliminado exitoso" });
    } catch (error) {
        callback({ "status": 400, "message": "upsss, ocurrio un error" });
    }
}

function Update(condition, set, collection, callback) {
    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db(nameDataBase);
        UpdateData(condition, set, collection, dbase, callback)
    });
}

const UpdateData = async function(condition, set, col, db, callback) {
    const collection = db.collection(col);
    try {
        collection.update(condition, set);
        callback({ "status": 200, "message": "actualizacion exitosa" });
    } catch (error) {
        callback({ "status": 400, "message": "upsss, ocurrio un error" });
    }
}

exports.getMeetPersons = function(req, res) {
    gettodb({ _id: 0, user: 1, image: 1 }, (documentos) => {
        res.send(documentos);
    })
}


function gettodb(query, callback) {
    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db(nameDataBase); //here
        findDateDb(query, dbase, callback)
    });
}

const findDateDb = async function(query, db, callback) {
    const collection = db.collection(collectionPerson);
    collection.find({}).project(query).toArray(function(err, docs) {
        callback(docs)
    });
}