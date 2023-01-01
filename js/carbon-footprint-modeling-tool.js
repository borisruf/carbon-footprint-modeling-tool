// ordered list of emissions
const emissionUnitMap = {"co2e": "CO2e", "co2": "CO2", "ch4": "CH4", "n2o": "N2O", "hfcs": "HFCs", "pfcs": "PFCs", "sf6": "SF6", "nf33": "NF33"};
// ordered list of consumptions
const consumptionMap = {"electricity": "Electricity", "regular gasoline": "Regular Gasoline", "premium gasoline": "Premium Gasoline", "bunker fuel": "Bunker Fuel", "diesel": "Diesel", "oil": "Oil"}
// list of accepted (mass) units
const massUnits = ["g", "kg", "t"];

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// save with new random scenario id
function copyJSON() { downloadJSON("scenario-" + uuidv4() + ".json"); }

// save with same scenario id
function saveJSON() { downloadJSON(id + ".json") }

function downloadJSON(filename) {

    var fileContent = JSON.stringify(scenario, null, 2);
    var bb = new Blob([fileContent ], { type: "text/plain" });
    var a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(bb);
    a.click();
}

function makeUrl() {
    var fileContent = JSON.stringify(scenario);
    let url = location.protocol + '//' + location.host + location.pathname + '?#' + btoa(unescape(encodeURIComponent(fileContent)))
    window.open(url, '_blank').focus();
}

function formatTotalEmissions(value_in_kg, emission_type) {

    let value = value_in_kg;
    let unit = "kg";
    if (value_in_kg >= 1000000000) {
        value = value_in_kg/1000000000;
        unit = "mt";
    } else if (value_in_kg >= 1000000) {
        value = value_in_kg/1000000;
        unit = "kt";
    } else if (value_in_kg >= 1000) {
        value = value_in_kg/1000;
        unit = "t";
    } else if (value_in_kg < 1) {
        value = value_in_kg*1000;
        unit = "g";
    }
    return Math.round(value * 100) / 100 + unit + " " + emissionUnitMap[emission_type];
}

// TODO: generalize with unit table
function convertValue(value, source_unit, target_unit) {
    if (target_unit.toLowerCase() == "kg") {
        if (source_unit.toLowerCase() == "t") {
            return value*1000;
        } else if (source_unit.toLowerCase() == "g") {
            return value/1000;
        }
    }
    return value;
}

// calculate scope emissions from JSON data
function calculateScopeEmissions(scope) {
    let emissions = {};

    for (const [j, element] of scope.list.entries()) {


        emissions[j] = {};

        if (element.type == "component") {
            let usage_factor = 1;
            let consumption;

            // consumption data available
            if (element.consumer.consumptions && Object.keys(element.consumer.consumptions).length) {
                // check for consumption data suitable for selected energy source
                consumption = element.consumer.consumptions[element.source.type];
            }

            // consumption data available for selected energy
            if (consumption) {
                usage_factor = consumption.value;
            }

            // suitable consumption data is available OR component does not feature consumption information
            if (consumption || !element.consumer.consumptions || Object.keys(element.consumer.consumptions).length == 0) {

                for (emission_type of Object.keys(element.source.emissions)) {
                    
                    // consumer has no consumption info or consumer unit is equal or can be converted to source base unit
                    if (!consumption || element.source.emissions[emission_type].base_unit == consumption.unit || [element.source.emissions[emission_type].base_unit, consumption.unit].every(r=> massUnits.includes(r.toLowerCase()))) {

                        // conversion is required
                        //TODO: refactor once the unit table is complete with all supported units (currently, any equal unit gets a pass)
                        if (consumption && element.source.emissions[emission_type].base_unit != consumption.unit) {
                            usage_factor = convertValue(usage_factor, consumption.unit, element.source.emissions[emission_type].base_unit)
                        }
                        
                        emissions[j][emission_type] = 
                            convertValue(Number(element.quantity), element.quantity_unit, element.source.emissions[emission_type].base_unit)
                            *Number(usage_factor)
                            // convert emissions to kg
                            *convertValue(Number(element.source.emissions[emission_type]["value"]), element.source.emissions[emission_type]["unit"], "kg");

                    } else {
                        console.warn("Consumer unit (" + element.consumer.name +  ") and source base unit (" + element.source.name + ") do not match: " + consumption.unit + " <--> " + element.source.emissions[emission_type].base_unit)
                    }
                }
            } else {      
                console.warn("Consumer (" + element.consumer.name +  ") has no matching consumption data for selected energy source (" + element.source.name + ")")
            }
                
        } else if (element.type == "link") {
            let request = new XMLHttpRequest();
            request.open("GET", "./scenarios/" + element.scenario_id + ".json", false);
            request.setRequestHeader('Cache-Control', 'no-cache');
            request.send(null)
            let json = JSON.parse(request.responseText);
            let linkedEmissions = totalEmissions(json);
            
            // consider quantity parameter if any
            if (Number(element.quantity)) {
                Object.keys(linkedEmissions).map(function(key, index) {
                    linkedEmissions[key] *= element.quantity;
                });
            }

            emissions[j] = linkedEmissions;
        }
    }
    return emissions;
}

// identify best emission type available for single component
function bestEmissionType(emissions) {
    for (unit in emissionUnitMap) {
        if (emissions[unit] != null) {
            return unit;
        }
    } 
}

// identify emission types available for all components of the scope
function availableTotalEmissionTypes(emissions) {

    let units = [];
    for (unit in emissionUnitMap) {
        let count = 0;
        for (e in emissions) {
            // emission information for this component exists
            if (emissions[e][unit] != null) {
                count +=1;
            }
        }
        if (count == Object.keys(emissions).length) {
            units.push(unit); 
        }
    }
    return units;
}

// identify best emission type available for all components of the scope
function bestTotalEmissionType(emissions) {
    return availableTotalEmissionTypes(emissions)[0];
}

function totalEmissionsByUnit(emissions, unit) {
    return Object.keys(emissions).map(e => emissions[e][unit]).reduce((a, b) => a + b, 0)
}

// calculate emissions from JSON data and update DOM
function updateView(scenario_json) {

    for (const [i, scope] of scenario_json.scopes.entries()) {

        // calculate emissions per scope
        let emissions = calculateScopeEmissions(scope);

        let scopeDiv = document.querySelectorAll("div[name='scope']:not(.template)")[i];

        let unit;
        let subTotalMessage;

        for (const [j, element] of scope.list.entries()) {

            let elementDiv = scopeDiv.querySelectorAll("div[name='component'], div[name='link']")[j];
            let sourceConnectors = elementDiv.querySelectorAll("div.connector");

            if (Object.keys(emissions[j]).length) {

                unit = emission_type_parameter || bestEmissionType(emissions[j]);
                subTotalMessage = formatTotalEmissions(emissions[j][unit], unit);
                if (Object.keys(sourceConnectors).length) {sourceConnectors[1].innerHTML = "-----";}

            } else {
                subTotalMessage = "";
                if (Object.keys(sourceConnectors).length) {sourceConnectors[1].innerHTML = "--||--";}
            }

            // update sub total message
            elementDiv.querySelectorAll(".emission_sub_total")[0].innerHTML = subTotalMessage;
        }

        let best_unit = emission_type_parameter || bestTotalEmissionType(emissions);
        let totalMessage = scopeDiv.getElementsByClassName("total_emission")[0];

        // update total emissions with best common emission type
        if (best_unit) {
            let sum = totalEmissionsByUnit(emissions, best_unit);

            totalMessage.innerHTML = formatTotalEmissions(sum, best_unit);

        } else {
            console.warn("No common emission type available for " + scope.level);
            totalMessage.innerHTML = "ʘ ʘ<br />o";
        }
        
    }
}

function updateData() {
    
    let root = document.getElementById("container");
    // update global scenario variable
    scenario = traverseDOMtree(root);

    // update emission calculations
    updateView(scenario);
}

// browse the DOM element for all non-nested data elements
function filter(element) {

    let nodes = [].slice.call(element.querySelectorAll(".data"));

    for (var i = nodes.length - 1; i >= 0; i--) {
        
        if (!notNested(nodes[i], element)) { 
            nodes.splice(i, 1);
        }
    }
    return nodes;
}

// check if the element is the direct "data" descendant from root (not considering non-data elements),
// or if it is nested in another data element (using querySelector with CSS selector does not support this)
function notNested(element, root) {

    // start with first parent since current element is data element 
    element = element.parentNode;       

    while (element.parentNode != null && element != root) {

        if (element.classList.contains("data")) {
            return false
        }            
        element = element.parentNode;
    }
    return true
}

function traverseDOMtree(element) {

    // this element is a leaf node, it has no children
    if (["string", "number"].includes(element.dataset.type)) {

        if (element.nodeName == "A") {
            return element.href;
        } else if (element.nodeName == "INPUT") {
            return element.value;
        } else {
            return element.innerHTML;
        }
    }

    // this element is a tree node (object or array), it has children  
    let y = {};

    // browse the tree for all non-nested data elements
    let children = filter(element)

    for (const c of children) {
        
        let v = null;
        // object
        if (c.dataset.type == "object") {
            let j = {};
            let c_children = filter(c); 
            for (const d of c_children) {
                v = traverseDOMtree(d); 
                j[d.getAttribute("name")] = v;
            }
            y[c.getAttribute("name")] = j;
            

        // array
        } else if (c.dataset.type == "array") {
            let j = [];
            let c_children = filter(c);
            for (const d of c_children) {
                v = traverseDOMtree(d); 
                j.push(v);
            }
            y[c.getAttribute("name")] = j;

        // string or number
        } else {
            y[c.getAttribute("name")] = traverseDOMtree(c);
        }
    }
    return y;
}

// calculate total emissions for all scopes of one scenario
function totalEmissions(scenario_json) {

    let emissions = [];

    for (const [i, scope] of scenario_json.scopes.entries()) {

        // omit scopes and create flat emissions array
        emissions = emissions.concat(Object.values(calculateScopeEmissions(scope)));
    }

    let available_units = availableTotalEmissionTypes(emissions);

    // reduce emissions to emission types available for all components
    for (e in emissions) {
        for (c in e) {
            if (!available_units.includes(c)) {
                delete e[c];
            }                        
        }
    }

    let sums = [];
    
    available_units.forEach(function (unit, index) {
        sums[unit] = totalEmissionsByUnit(emissions, unit);
    });                        

    return sums
}


//TODO: refactor and cover in calculateEmissions 
function updateLink(scenario_id, div) {
    fetch("./scenarios/" + scenario_id + ".json")
        .then(response => response.json())
        .then(data => {
            div.querySelector("[name='title']").innerHTML = data.title;
        });
}

function toggleDetails(div) {
    
    let details = div.parentNode.querySelectorAll(".details");
    let icons = div.parentNode.querySelectorAll(".edit-icon");
    let show = (window.getComputedStyle(details[0]).display === "none");

    for (let i = 0; i < details.length; i++) {
        details[i].style.display =  show ? "block" : "none";                
    }

    for (let i = 0; i < icons.length; i++) {
        icons[i].style.display =  show ? "block" : "none";
    }
}

function toggleSearchConsumerOverlay(event) {
    event.stopPropagation();

    // ignore if clicked element is child
    if (event.target !== this)
            return;

    let overlay = document.getElementById("searchConsumerOverlay");

    let show = (window.getComputedStyle(overlay).display === "none");

    overlay.style.display = show ? "block" : "none";
    let input = overlay.querySelector("#searchConsumerInput");
    input.value = "";
    input.focus();

    if (show) {
        let rowDiv = event.target.closest("div.row");
        rowDiv.setAttribute("data-active", true);
    } else {
        document.querySelector("div.row[data-active='true']").setAttribute("data-active", false);
    }
}

function toggleSearchSourceOverlay(event) {
    event.stopPropagation();

    // ignore if clicked element is child
    if (event.target !== this)
            return;

    let overlay = document.getElementById("searchSourceOverlay");

    let show = (window.getComputedStyle(overlay).display === "none");

    overlay.style.display = show ? "block" : "none";
    let input = overlay.querySelector("#searchSourceInput")
    input.value = "";
    input.focus();

    if (show) {
        let rowDiv = event.target.closest("div.row");
        rowDiv.setAttribute("data-active", true);
        input.placeholder = "Search energy source ...";

    } else {
        document.querySelector("div.row[data-active='true']").setAttribute("data-active", false);
    }
}