var forEach = require('async-foreach').forEach;
var fields = require('./fields');
var utils = require('./utils');
var constant = require('../constant');

function addAggregationToImport(entity, attr) {
    let objRelationship = {};
    /* UMLAssociation (aggregation) */
    console.log("-----aggregation", entity.name);

    // objRelationship._id="";
    objRelationship._type = 'UMLAssociation';
    objRelationship.name = attr.name;
    objRelationship.documentation = attr.description;
    objRelationship._parent = {
        '$ref': entity._id
    };

    /* Source */
    let objEnd1 = {};
    objRelationship.end1 = objEnd1;
    objEnd1._type = 'UMLAssociationEnd';
    objEnd1.aggregation = 'shared';

    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    objEnd1.multiplicity = source.cardinality;
    objEnd1.navigable = source.navigable;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });

    let objReferenceEnd1 = {};
    let objReferenceEnd2 = {};

    /* target */
    let objEnd2 = {};
    objEnd2._type = 'UMLAssociationEnd';
    objRelationship.end2 = objEnd2;
    objEnd2.aggregation = 'none';

    let target = attr.target;
    objEnd2.multiplicity = target.cardinality;
    objEnd2.navigable = target.navigable;
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });

    let eleType = utils.getElementType(entity);
    if (fRefEnd2.length > 0 && fRefEnd1.length > 0) {
        objReferenceEnd2['$ref'] = fRefEnd2[0]._id;
        objEnd2.reference = objReferenceEnd2;

        objReferenceEnd1['$ref'] = fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;

    } else if (fRefEnd1.length == 0) {
        throw new Error(constant.source + ' ' + eleType + ' \'' + source.name + constant.ref_not_found);
    } else if (fRefEnd2.length == 0) {
        throw new Error(constant.target + ' ' + eleType + ' \'' + target.name + constant.ref_not_found);
    }
    return objRelationship;
}

function updateAggregationToImport(entity, attr, _id) {
    /* UMLAssociation (aggregation) */
    let UMLAssociation = app.repository.get(_id);

    app.engine.setProperty(UMLAssociation, 'name', attr.name);
    app.engine.setProperty(UMLAssociation, 'documentation', attr.description);

    /* Source */
    let objEnd1 = {};
    if (UMLAssociation.end1.hasOwnProperty('_id')) {
        objEnd1._id = UMLAssociation.end1._id;
    }
    objEnd1._parent = {
        '$ref': UMLAssociation._id
    };
    objEnd1._type = 'UMLAssociationEnd';
    objEnd1.aggregation = 'shared';

    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    objEnd1.multiplicity = source.cardinality;
    objEnd1.navigable = source.navigable;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });

    let objReferenceEnd1 = {}

    /* target */
    let objEnd2 = {};
    if (UMLAssociation.end2.hasOwnProperty('_id')) {
        objEnd2._id = UMLAssociation.end2._id;
    }
    objEnd2._parent = {
        '$ref': UMLAssociation._id
    };
    objEnd2._type = 'UMLAssociationEnd';
    objEnd2.aggregation = 'none';

    let target = attr.target;
    objEnd2.multiplicity = target.cardinality;
    objEnd2.navigable = target.navigable;
    let objReferenceEnd2 = {}
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });

    let eleType = utils.getElementType(entity);
    if (fRefEnd2.length > 0 && fRefEnd1.length > 0) {
        objReferenceEnd2['$ref'] = fRefEnd2[0]._id;
        objEnd2.reference = objReferenceEnd2;

        objReferenceEnd1['$ref'] = fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;

        app.engine.setProperty(UMLAssociation, 'end1', app.repository.readObject(objEnd1));
        app.engine.setProperty(UMLAssociation, 'end2', app.repository.readObject(objEnd2));
        return UMLAssociation;

    } else if (fRefEnd1.length == 0) {
        throw new Error(constant.source + ' ' + eleType + ' \'' + source.name + constant.ref_not_found);
    } else if (fRefEnd2.length == 0) {
        throw new Error(constant.target + ' ' + eleType + ' \'' + target.name + constant.ref_not_found);
    }
    return UMLAssociation;
}

function addCompositionToImport(entity, attr) {
    let objRelationship = {};
    /* UMLAssociation (composition) */
    console.log("-----composition", entity.name);


    objRelationship._type = 'UMLAssociation';
    objRelationship.name = attr.name;
    objRelationship.documentation = attr.description;
    objRelationship._parent = {
        '$ref': entity._id
    };
    /* Source */
    let objEnd1 = {};
    objRelationship.end1 = objEnd1;
    objEnd1._type = 'UMLAssociationEnd';
    objEnd1.aggregation = 'composite';

    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    objEnd1.multiplicity = source.cardinality;
    objEnd1.navigable = source.navigable;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });

    let objReferenceEnd1 = {}
    /* if(fRefEnd1.length>0){
        objReferenceEnd1['$ref']=fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;
    } */
    /* target */
    let objEnd2 = {};
    objEnd2._type = 'UMLAssociationEnd';
    objRelationship.end2 = objEnd2;
    objEnd2.aggregation = 'none';

    let target = attr.target;
    objEnd2.multiplicity = target.cardinality;
    objEnd2.navigable = target.navigable;
    let objReferenceEnd2 = {}
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });
    let eleType = utils.getElementType(entity);
    if (fRefEnd2.length > 0 && fRefEnd1.length > 0) {
        objReferenceEnd2['$ref'] = fRefEnd2[0]._id;
        objEnd2.reference = objReferenceEnd2;

        objReferenceEnd1['$ref'] = fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;
    } else if (fRefEnd1.length == 0) {
        throw new Error(constant.source + ' ' + eleType + ' \'' + source.name + constant.ref_not_found);
    } else if (fRefEnd2.length == 0) {
        throw new Error(constant.target + ' ' + eleType + ' \'' + target.name + constant.ref_not_found);
    }

    return objRelationship;
}

function updateCompositionToImport(entity, attr, _id) {
    /* UMLAssociation (composition) */

    let UMLAssociation = app.repository.get(_id);

    app.engine.setProperty(UMLAssociation, 'name', attr.name);
    app.engine.setProperty(UMLAssociation, 'documentation', attr.description);

    /* Source */
    let objEnd1 = {};
    if (UMLAssociation.end1.hasOwnProperty('_id')) {
        objEnd1._id = UMLAssociation.end1._id;
    }
    objEnd1._parent = {
        '$ref': UMLAssociation._id
    };
    objEnd1._type = 'UMLAssociationEnd';
    objEnd1.aggregation = 'composite';

    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    objEnd1.multiplicity = source.cardinality;
    objEnd1.navigable = source.navigable;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });

    let objReferenceEnd1 = {}
    /* target */
    let objEnd2 = {};
    if (UMLAssociation.end2.hasOwnProperty('_id')) {
        objEnd2._id = UMLAssociation.end2._id;
    }
    objEnd2._parent = {
        '$ref': UMLAssociation._id
    };
    objEnd2._type = 'UMLAssociationEnd';
    objEnd2.aggregation = 'none';

    let target = attr.target;
    objEnd2.multiplicity = target.cardinality;
    objEnd2.navigable = target.navigable;
    let objReferenceEnd2 = {}
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });
    let eleType = utils.getElementType(entity);
    if (fRefEnd2.length > 0 && fRefEnd1.length > 0) {
        objReferenceEnd2['$ref'] = fRefEnd2[0]._id;
        objEnd2.reference = objReferenceEnd2;

        objReferenceEnd1['$ref'] = fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;

        app.engine.setProperty(UMLAssociation, 'end1', app.repository.readObject(objEnd1));
        app.engine.setProperty(UMLAssociation, 'end2', app.repository.readObject(objEnd2));
        return UMLAssociation;

    } else if (fRefEnd1.length == 0) {
        throw new Error(constant.source + ' ' + eleType + ' \'' + source.name + constant.ref_not_found);
    } else if (fRefEnd2.length == 0) {
        throw new Error(constant.target + ' ' + eleType + ' \'' + target.name + constant.ref_not_found);
    }

    return UMLAssociation;
}

function addGeneralizationToImport(objRelationship, entity, attr) {
    console.log("-----generalization", entity.name);


    objRelationship._type = 'UMLGeneralization';
    objRelationship.name = attr.name;
    objRelationship.documentation = attr.description;
    objRelationship._parent = {
        '$ref': entity._id
    };

    /* Source */
    let objEnd1 = {};
    objRelationship.source = objEnd1;
    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });


    if (fRefEnd1.length > 0) {
        objEnd1['$ref'] = fRefEnd1[0]._id;
    }
    /* target */
    let objEnd2 = {};
    objEnd2._type = 'UMLClass';
    objRelationship.target = objEnd2;

    let target = attr.target;
    let objReferenceEnd2 = {}
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });

    if (fRefEnd2.length > 0) {
        objEnd2['$ref'] = fRefEnd2[0]._id;
    }


    return objRelationship;
}

function updateGeneralizationToImport(entity, attr, _id) {
    console.log("-----generalization", entity.name);
    let UMLGeneralization = app.repository.get(_id);

    app.engine.setProperty(UMLGeneralization, 'name', attr.name);
    app.engine.setProperty(UMLGeneralization, 'documentation', attr.description);

    /* Source */
    /* 
    let objSource = {};
    if (UMLGeneralization.source.hasOwnProperty('_id')) {
        objSource._id = UMLGeneralization.source._id;
    }
    objSource._parent = {
        '$ref': UMLGeneralization._id
    };
    objSource._type = 'UMLClass';

    let source = attr.source;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });


    if (fRefEnd1.length > 0) {
        app.engine.setProperty(UMLGeneralization, 'source', app.repository.readObject(objSource));
    }
     */
    /* target */
    /* 
    let objTarget = {};
    if (UMLGeneralization.target.hasOwnProperty('_id')) {
        objTarget._id = UMLGeneralization.target._id;
    }
    objTarget._parent = {
        '$ref': UMLGeneralization._id
    };
    objTarget._type = 'UMLClass';

    let target = attr.target;
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });

    if (fRefEnd2.length > 0) {
        app.engine.setProperty(UMLGeneralization, 'target', app.repository.readObject(objTarget));
    }
    */

    return UMLGeneralization;
}

function addInterfaceRealizationToImport(objRelationship, entity, attr) {
    console.log("-----interfaceRealization", entity.name);
    objRelationship._type = 'UMLInterfaceRealization';
    objRelationship.name = attr.name;
    objRelationship.documentation = attr.description;
    objRelationship._parent = {
        '$ref': entity._id
    };
    /* Source */
    let objEnd1 = {};
    objRelationship.source = objEnd1;
    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });


    if (fRefEnd1.length > 0) {
        objEnd1['$ref'] = fRefEnd1[0]._id;
    }
    /* target */
    let objEnd2 = {};
    objEnd2._type = 'UMLClass';
    objRelationship.target = objEnd2;

    let target = attr.target;
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });

    if (fRefEnd2.length > 0) {
        objEnd2['$ref'] = fRefEnd2[0]._id;
    }

    return objRelationship;
}

function updateInterfaceRealizationToImport(entity, attr, _id) {
    console.log("-----generalization", entity.name);
    let UMLInterfaceRealization = app.repository.get(_id);

    app.engine.setProperty(UMLInterfaceRealization, 'name', attr.name);
    app.engine.setProperty(UMLInterfaceRealization, 'documentation', attr.description);

    /* Source */
    /* 
    let objSource = {};
    if (UMLInterfaceRealization.source.hasOwnProperty('_id')) {
        objSource._id = UMLInterfaceRealization.source._id;
    }
    objSource._parent = {
        '$ref': UMLInterfaceRealization._id
    };
    objSource._type = 'UMLClass';

    let source = attr.source;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });


    if (fRefEnd1.length > 0) {
        app.engine.setProperty(UMLInterfaceRealization, 'source', app.repository.readObject(objSource));
    }
     */
    /* target */
    /* 
    let objTarget = {};
    if (UMLInterfaceRealization.target.hasOwnProperty('_id')) {
        objTarget._id = UMLInterfaceRealization.target._id;
    }
    objTarget._parent = {
        '$ref': UMLInterfaceRealization._id
    };
    objTarget._type = 'UMLClass';

    let target = attr.target;
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });

    if (fRefEnd2.length > 0) {
        app.engine.setProperty(UMLInterfaceRealization, 'target', app.repository.readObject(objTarget));
    }
    */

    return UMLInterfaceRealization;
}

function addAssociationClassLink(objRelationship, entity, attr) {
    console.log("-----interface", entity.name);

    objRelationship._type = 'UMLAssociationClassLink';
    objRelationship.name = attr.name;
    objRelationship.documentation = attr.description;
    objRelationship._parent = {
        '$ref': entity._id
    };
    /* associationSide */
    let associationSide = {};
    let bindAssos = bindRelationshipToImport(entity, attr.association, true);
    //let associationSide=app.repository.writeObject(bindAssos);
    if (bindAssos && bindAssos.hasOwnProperty('_id')) {
        associationSide['$ref'] = bindAssos._id;
    }
    objRelationship.associationSide = associationSide; //JSON.parse(associationSide);
    /* classSide */
    let classSide = {};
    objRelationship.classSide = classSide;
    let mClass = attr.class;
    let refClass = app.repository.search(mClass.name);
    let fRefClass = refClass.filter(function (item) {
        return item.name == mClass.name;
    });

    if (fRefClass.length > 0) {
        classSide['$ref'] = fRefClass[0]._id;
    }
    return objRelationship;
}

function updateAssociationClassLink(entity, attr, _id) {
    console.log("-----interface", entity.name);

    let UMLAssociationClassLink = app.repository.get(_id);

    // objRelationship._type = 'UMLAssociationClassLink';
    // objRelationship.name = attr.name;
    // objRelationship.documentation = attr.description;
    app.engine.setProperty(UMLAssociationClassLink, 'name', attr.name);
    app.engine.setProperty(UMLAssociationClassLink, 'documentation', attr.description);

    /* associationSide */
    // let associationSide = {};
    let associationSide = bindRelationshipToImport(entity, attr.association, true);
    // let associationSide = bindRelationshipToImport(entity, attr.association, true);
    //let associationSide=app.repository.writeObject(bindAssos);
    /* if (bindAssos && bindAssos.hasOwnProperty('_id')) {
        associationSide['$ref'] = bindAssos._id;
    } */
    app.engine.setProperty(UMLAssociationClassLink, 'associationSide', associationSide);
    /* classSide */
    let mClass = attr.class;
    let refClass = app.repository.search(mClass.name);
    let fRefClass = refClass.filter(function (item) {
        return item.name == mClass.name;
    });

    let classSide;
    if (fRefClass.length > 0) {
        classSide = fRefClass[0];
    }
    app.engine.setProperty(UMLAssociationClassLink, 'classSide', classSide);
    return UMLAssociationClassLink;
}

function addInterfaceToImport(objRelationship, entity, attr) {

    console.log("-----interface", entity.name);

    objRelationship._type = 'UMLAssociation';
    objRelationship.name = attr.name;
    objRelationship.documentation = attr.description;
    objRelationship._parent = {
        '$ref': entity._id
    };
    /* Source */
    let objEnd1 = {};
    objRelationship.end1 = objEnd1;
    objEnd1._type = 'UMLAssociationEnd';
    objEnd1.aggregation = 'none';

    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    objEnd1.multiplicity = source.cardinality;
    objEnd1.navigable = source.navigable;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });

    let objReferenceEnd1 = {}
    /* if(fRefEnd1.length>0){
        objReferenceEnd1['$ref']=fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;
    } */
    /* target */
    let objEnd2 = {};
    objEnd2._type = 'UMLAssociationEnd';
    objRelationship.end2 = objEnd2;
    objEnd2.aggregation = 'none';

    let target = attr.target;
    objEnd2.multiplicity = target.cardinality;
    objEnd2.navigable = target.navigable;
    let objReferenceEnd2 = {}
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });
    let eleType = utils.getElementType(entity);
    if (fRefEnd2.length > 0 && fRefEnd1.length > 0) {
        objReferenceEnd2['$ref'] = fRefEnd2[0]._id;
        objEnd2.reference = objReferenceEnd2;

        objReferenceEnd1['$ref'] = fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;
    } else if (fRefEnd1.length == 0) {
        throw new Error(constant.source + ' ' + eleType + ' \'' + source.name + constant.ref_not_found);
    } else if (fRefEnd2.length == 0) {
        throw new Error(constant.target + ' ' + eleType + ' \'' + target.name + constant.ref_not_found);
    }

    return objRelationship;
}

function updateInterfaceToImport(entity, attr, _id) {
    let UMLAssociation = app.repository.get(_id);
    // objRelationship._type = 'UMLAssociation';
    // objRelationship.name = attr.name;
    // objRelationship.documentation = attr.description;
    app.engine.setProperty(UMLAssociation, 'name', attr.name);
    app.engine.setProperty(UMLAssociation, 'documentation', attr.description);
    /* Source */
    let objEnd1 = {};
    if (UMLAssociation.end1.hasOwnProperty('_id')) {
        objEnd1._id = UMLAssociation.end1._id;
    }
    objEnd1._parent = {
        '$ref': UMLAssociation._id
    };
    // objRelationship.end1 = objEnd1;
    objEnd1._type = 'UMLAssociationEnd';
    objEnd1.aggregation = 'none';

    /* Reference to UMLClass or UMLInterface */

    let source = attr.source;
    objEnd1.multiplicity = source.cardinality;
    objEnd1.navigable = source.navigable;
    let refEnd1 = app.repository.search(source.name);

    let fRefEnd1 = refEnd1.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == source.name;
    });

    let objReferenceEnd1 = {}
    /* if(fRefEnd1.length>0){
        objReferenceEnd1['$ref']=fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;
    } */
    /* target */
    let objEnd2 = {};
    if (UMLAssociation.end2.hasOwnProperty('_id')) {
        objEnd2._id = UMLAssociation.end2._id;
    }
    objEnd2._parent = {
        '$ref': UMLAssociation._id
    };
    objEnd2._type = 'UMLAssociationEnd';
    // objRelationship.end2 = objEnd2;
    objEnd2.aggregation = 'none';

    let target = attr.target;
    objEnd2.multiplicity = target.cardinality;
    objEnd2.navigable = target.navigable;
    let objReferenceEnd2 = {}
    let refEnd2 = app.repository.search(target.name);

    let fRefEnd2 = refEnd2.filter(function (item) {
        return (item instanceof type.UMLClass || item instanceof type.UMLInterface) && item.name == target.name;
    });
    let eleType = utils.getElementType(entity);
    if (fRefEnd2.length > 0 && fRefEnd1.length > 0) {
        objReferenceEnd2['$ref'] = fRefEnd2[0]._id;
        objEnd2.reference = objReferenceEnd2;


        objReferenceEnd1['$ref'] = fRefEnd1[0]._id;
        objEnd1.reference = objReferenceEnd1;


        app.engine.setProperty(UMLAssociation, 'end1', app.repository.readObject(objEnd1));
        app.engine.setProperty(UMLAssociation, 'end2', app.repository.readObject(objEnd2));
        return UMLAssociation;

    } else if (fRefEnd1.length == 0) {
        throw new Error(constant.source + ' ' + eleType + ' \'' + source.name + constant.ref_not_found);
    } else if (fRefEnd2.length == 0) {
        throw new Error(constant.target + ' ' + eleType + ' \'' + target.name + constant.ref_not_found);
    }
    return UMLAssociation;
}

function bindRelationshipToImport(entity, attr, isACL /* isAssociationClassLink */ ) {

    if (attr.type == fields.aggregation) {

        /* UMLAssociation (aggregation) */
        let mAssoc = utils.isAssociationExist(entity, attr);
        if (mAssoc.isExist) {
            return updateAggregationToImport(entity, attr, mAssoc.assoc._id);
        } else {

            let objRelationship = addAggregationToImport(entity, attr);
            if (objRelationship != null || Object.keys(objRelationship).length == 0) {
                let rel = app.repository.readObject(objRelationship);
                /* Avoid creating UMLAssociationView if it is UMLAssociationClassLink */
                if (isACL == null || !isACL) {
                    utils.addNewAddedElement(rel);
                }
                return rel;
            }
        }
    } else if (attr.type == fields.composition) {

        /* UMLAssociation (composition) */
        let mAssoc = utils.isAssociationExist(entity, attr);
        if (mAssoc.isExist) {
            return updateCompositionToImport(entity, attr, mAssoc.assoc._id);
        } else {
            let objRelationship = addCompositionToImport(entity, attr);
            if (objRelationship != null || Object.keys(objRelationship).length == 0) {
                let rel = app.repository.readObject(objRelationship);
                console.log("rel", rel);
                utils.addNewAddedElement(rel);
                return rel;
            }
        }
    } else if (attr.type == fields.generalization) {

        /* UMLGeneralization (generalization) */
        let objRelationship = {};
        let mAssoc = utils.isGeneralizationExist(entity, attr);
        if (mAssoc.isExist) {
            return updateGeneralizationToImport(entity, attr, mAssoc.assoc._id);
        } else {
            objRelationship = addGeneralizationToImport(objRelationship, entity, attr)
            if (objRelationship != null || Object.keys(objRelationship).length == 0) {
                let rel = app.repository.readObject(objRelationship);
                utils.addNewAddedElement(rel);
                return rel;
            }
        }
    } else if (attr.type == fields.interfaceRealization) {
        /* UMLInterfaceRealization (interfaceRealization) */
        let objRelationship = {};
        let mAssoc = utils.isInterfaceRealizationExist(entity, attr);
        if (mAssoc.isExist) {
            return updateInterfaceRealizationToImport(entity, attr, mAssoc.assoc._id);
        } else {
            objRelationship = addInterfaceRealizationToImport(objRelationship, entity, attr);
            if (objRelationship != null || Object.keys(objRelationship).length == 0) {
                let rel = app.repository.readObject(objRelationship);
                utils.addNewAddedElement(rel);
                return rel;
            }
        }
    } else if (attr.type == fields.interface) {

        /* UMLAssociation (interface) */
        let objRelationship = {};
        let mAssoc = utils.isAssociationExist(entity, attr);
        if (mAssoc.isExist) {
            return updateInterfaceToImport(entity, attr, mAssoc.assoc._id);

        } else {
            objRelationship = addInterfaceToImport(objRelationship, entity, attr);
            if (objRelationship != null || Object.keys(objRelationship).length == 0) {
                let rel = app.repository.readObject(objRelationship);
                utils.addNewAddedElement(rel);
                return rel;
            }
        }
    } else if (attr.type == fields.associationClassLink) {

        /* UMLAssociation (associationClassLink) */
        let objRelationship = {};
        let mAssoc = utils.isAssociationClassLinkExist(entity, attr);
        if (mAssoc.isExist) {
            return updateAssociationClassLink(entity, attr, mAssoc.assoc._id);
        } else {

            objRelationship = addAssociationClassLink(objRelationship, entity, attr);
            if (objRelationship != null || Object.keys(objRelationship).length == 0) {
                let rel = app.repository.readObject(objRelationship);
                utils.addNewAddedElement(rel);
                return rel;
            }
        }
    }
}

function setRelationship(ownedElements, XMIData) {
    forEach(ownedElements, function (entity) {
        if (entity instanceof type.UMLClass || entity instanceof type.UMLInterface) {
            let mSubObject = XMIData[entity.name];
            console.log("class name " + mSubObject.name);
            console.log("class name--------Relationship----Start");
            let oldOwnedElements = entity.ownedElements;
            
            forEach(mSubObject.Relationship, function (relationship) {
                try {
                    if (
                        relationship.type == fields.aggregation ||
                        relationship.type == fields.composition ||
                        relationship.type == fields.generalization ||
                        relationship.type == fields.interface ||
                        relationship.type == fields.interfaceRealization ||
                        relationship.type == fields.associationClassLink
                    ) {
                        let rel = bindRelationshipToImport(entity, relationship);
                        let mIndex=oldOwnedElements.findIndex(function (ele) {
                            return ele._id == rel._id;
                        });
                        if (mIndex == -1) {
                            /* New relationship */
                            console.log(" New relationship ");
                            oldOwnedElements.push(rel);
                        } else {
                            /* Existing relationship */
                            oldOwnedElements[mIndex]=rel;
                            console.log(" Existing relationship : " + mIndex);
                        }
                        app.engine.setProperty(entity, 'ownedElements', oldOwnedElements);
                    }
                } catch (error) {
                    console.error("Error : " + mSubObject.name, error.message);
                    app.dialogs.showErrorDialog(error.message);
                }
            });
        }
    });
}

module.exports.addAggregationToImport = addAggregationToImport;
module.exports.addCompositionToImport = addCompositionToImport;
module.exports.addGeneralizationToImport = addGeneralizationToImport;
module.exports.addInterfaceRealizationToImport = addInterfaceRealizationToImport;
module.exports.addInterfaceToImport = addInterfaceToImport;
module.exports.addAssociationClassLink = addAssociationClassLink;
module.exports.bindRelationshipToImport = bindRelationshipToImport;
module.exports.setRelationship = setRelationship;