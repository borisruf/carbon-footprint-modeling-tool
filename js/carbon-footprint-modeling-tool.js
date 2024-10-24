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
    window.open(a.href, '_blank'); // fallback for Safari
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
    } else if (value_in_kg >= 1) {
        value = value_in_kg;
        unit = "kg";
    } else if (value_in_kg >= 0.001) {
        value = value_in_kg*1000;
        unit = "g";
    } else if (value_in_kg < 0.001) {
        value = value_in_kg*1000000;
        unit = "mg";
    }
    return Math.round(value * 100) / 100 + unit + " " + emissionUnitMap[emission_type];
}

function convertValue(value, source_unit, target_unit) {
  const conversionRates = {
    "g_kg": 0.001,
    "g_t": 0.000001,
    "kg_g": 1000,
    "kg_t": 0.001,
    "t_g": 1000000,
    "t_kg": 1000
  };

  if (massUnits.includes(source_unit) && massUnits.includes(target_unit)) {
    const conversionKey = `${source_unit}_${target_unit}`;
    if (conversionRates.hasOwnProperty(conversionKey)) {
      return value * conversionRates[conversionKey];
    } else if (source_unit === target_unit) {
      return value; // No conversion needed
    } else {
      return "Conversion rate not available";
    }
  } else {
    return value;
  }
}

// calculate scope emissions from JSON data
function calculateScopeEmissions(scope, primary_source=null) {
    let emissions = {};

    for (const [j, element] of scope.list.entries()) {

        emissions[j] = {};

        if (element.type == "component") {
            let usage_factor = 1;
            let consumption;

            if (primary_source) {
                // overwrite source with primary source if provided
                element.source = primary_source;
            }

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

            let responseText;

            // The code is running in a Node.js environment - index creation mode
            if (typeof module !== 'undefined' && module.exports) {

                const request = require('sync-request');

                const res = request('GET', 'http://localhost:8000/scenarios/' + element.scenario_id + '.json', {
                  headers: {
                    'Cache-Control': 'no-cache'
                  }
                });

                if (res.statusCode === 200) {
                  responseText = res.getBody('utf8');
                } else {
                  // Handle the HTTP request error
                  console.error('Request failed with status code:', res.statusCode);
                }

            // The code is running in regular website mode
            } else {
  
                let request = new XMLHttpRequest();
                request.open("GET", "./scenarios/" + element.scenario_id + ".json", false);
                request.setRequestHeader('Cache-Control', 'no-cache');
                request.send(null)

                responseText = request.responseText;
            }      

            let json = JSON.parse(responseText);

            if (primary_source) {
                // overload sources with primary source if provided
                json = updateSource(json, primary_source)
            }

            let linkedEmissions = totalEmissions(json);
            
            // consider quantity parameter if any
            if (Number(element.quantity)) {
                Object.keys(linkedEmissions).map(function(key, index) {
                    linkedEmissions[key] *= element.quantity;
                });
            }

            emissions[j] = linkedEmissions;
        } else if (element.type == "scenario") {

            let scenarioEmissions = totalEmissions(element.scenario);
            
            // consider quantity parameter if any
            if (Number(element.quantity)) {
                Object.keys(scenarioEmissions).map(function(key, index) {
                    scenarioEmissions[key] *= element.quantity;
                });
            }

            emissions[j] = scenarioEmissions;
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
function updateView(scenario_json, scenario_id, primary_source=null) {

    let scenarioDiv = scenario_id ? document.getElementById(scenario_id) : document;

    // tweak for nested scenarios
    if (scenario_json.hasOwnProperty("scenario")) { scenario_json = scenario_json.scenario }

    for ([i, scope] of scenario_json.scopes.entries()) {

        // calculate emissions per scope
        let emissions = calculateScopeEmissions(scope, primary_source);

        let scopeDiv = scenarioDiv.querySelectorAll("div[name='scope']:not(.template)")[i];

        let unit;
        let subTotalMessage;

        for (const [j, element] of scope.list.entries()) {

            // recursive call when element is nested scenario
            if (element.type == "scenario") {updateView(element.scenario, element.scenario_id, primary_source)};

            let elementDiv = scopeDiv.querySelectorAll("div[name='component'], div[name='link'], div[name='nestedScenario']")[j];

            // get connector from direct children of element, may be empty for link or nested scenario
            let sourceConnector = Array.from(elementDiv.querySelectorAll(":scope > div.connector")).pop();

            if (Object.keys(emissions[j]).length) {

                unit = emission_type_parameter || bestEmissionType(emissions[j]);
                subTotalMessage = formatTotalEmissions(emissions[j][unit], unit);
                if (sourceConnector) {sourceConnector.innerHTML = "-----";}

            } else {
                subTotalMessage = "";
                if (sourceConnector) {sourceConnector.innerHTML = "--||--";}
            }

            // update sub total message
            Array.from(elementDiv.querySelectorAll(".emission_sub_total")).pop().innerHTML = subTotalMessage;
        }

        let best_unit = emission_type_parameter || bestTotalEmissionType(emissions);
        let totalMessage = Array.from(scopeDiv.querySelectorAll(".total_emission")).pop();

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

// recursively updates any source object in the JSON object provided with primary_source
function updateSource(json_object, primary_source) {
  if (json_object && typeof json_object === 'object') {
    if (json_object.hasOwnProperty('source')) {
      json_object.source = primary_source;
    }
    for (let key in json_object) {
      if (json_object.hasOwnProperty(key)) {
        updateSource(json_object[key], primary_source);
      }
    }
  }
  return json_object;
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
  let children = filter(element);

  if (element.dataset.type == "array") {

    // create an array to hold the output
    let arr = [];

    for (const c of children) {
      let v = traverseDOMtree(c);
      arr.push(v);
    }
    return arr;

  } else {

    // create an object to hold the output
    let obj = {};

    for (const c of children) {
      let v = traverseDOMtree(c);
      obj[c.getAttribute("name")] = v;
    }
    return obj;
  }
}

// calculate total emissions for all scopes of one scenario
function totalEmissions(scenario_json, factor=1, primary_source=null) {

    if (!factor) {
        factor = 1
    }

    let emissions = [];

    for (const [i, scope] of scenario_json.scopes.entries()) {

        // omit scopes and create flat emissions array
        emissions = emissions.concat(Object.values(calculateScopeEmissions(scope, primary_source)));
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

    let sums = {};

    available_units.forEach(function (unit, index) {
        sums[unit] = totalEmissionsByUnit(emissions, unit);
    });

    // multiply emission values by an optional factor (default=1)
    Object.keys(sums).forEach(key => {
        sums[key] *= factor;
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

// recursive function to populate the dom template with the JSON data
function populateTemplate(componentDiv, element, selectors) {
    
    for (const key of Object.keys(element)) {
        
        let _s = selectors + " [name='" + key + "']";
        let d = componentDiv.querySelector(_s);
        if (d) {
            d.setAttribute("data-type", typeof(element[key]));
        }

        // element is an object or array
        if (typeof(element[key]) == "object") {
            populateTemplate(componentDiv, element[key], _s);

        // element is a single value
        } else {   
            
            if (d) {
                if (d.nodeName == "A") {
                    d.href = element[key];
                } else if (d.nodeName == "INPUT") {
                    d.value = element[key];
                } else {
                    d.innerHTML = element[key];
                }
            } 
        }
    }
}

/* search consumer overlay and auto complete */
function addSearchOverlay() {

    document.querySelectorAll("#searchConsumerOverlay, div[name='consumer'] img.edit-icon").forEach(item => {
        item.addEventListener('click', toggleSearchConsumerOverlay)
    });

    const consumerAutoCompleteJS = new autoComplete({
        placeHolder: "Search for consumer ...",
        selector: "#searchConsumerInput",
        searchEngine: "loose",
        data: {
            src: Object.keys(consumers_json).map(key => (consumers_json[key])),
            keys: ["name", "description"],
            filter: (list) => {
                let searchCategories = consumerAutoCompleteJS.input.value.match(/type:[a-z_]+/);

                // search operator found
                if (searchCategories) {
                    let consumerCategory = searchCategories[0].split(":")[1];

                    const results = list.filter((item) => {
                        const itemCategory = item.value.category.toLowerCase();

                        // only propose consumer items of specified category
                        if (itemCategory == consumerCategory) {
                            return item.value;
                        }
                    });
                    return results;

                } else {
                    return list;
                }
            }
        },
        //remove search operators from query
        query: (input) => {
            return input.replace(/type:[a-z_]+\s+/, "");
        },
        resultsList: {
            element: (list, data) => {
                const info = document.createElement("p");
                if (data.results.length > 0) {
                    info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
                } else {
                    info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
                }
                list.prepend(info);
            },
            noResults: true,
            maxResults: 10
        },
        resultItem: {
            element: (item, data) => {
                item.style = "display: flex; justify-content: space-between;";
                item.innerHTML = `
                  <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                    ${data.value.name}<br/>
                    <span style="font-size: 13px; font-weight: 100; color: rgba(0,0,0,.2);">${data.value.description}</span>
                  </span>  
                  <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,1);">
                    ${Object.keys(data.value.consumptions).join(",<br/>")}
                  </span>`;
            },
            highlight: true
        }
    });

    consumerAutoCompleteJS.input.addEventListener("selection", function(event) {

        consumerAutoCompleteJS.input.blur();
        consumerAutoCompleteJS.input.value = "";

        // get selection data
        const feedback = event.detail;
        const selection = feedback.selection.value;

        // identify active consumer div
        let rowDiv = document.querySelector("div.row[data-active='true']");
        let consumerDiv = rowDiv.querySelector(".data[name='consumer']");
        let detailsDiv = consumerDiv.querySelector("div.details");

        // restore consumption information because not all consumers have one
        let consumptionsTemplate = document.querySelector(".template[name='component'] div[name='consumptions']").cloneNode(true);
        consumptionsTemplate.style.display = "block";

        let oldConsumptions = detailsDiv.querySelector("div div[name='consumptions']");

        if (oldConsumptions) detailsDiv.removeChild(oldConsumptions);
        detailsDiv.appendChild(consumptionsTemplate);

        // update consumer data
        populateTemplate(consumerDiv, selection, "");

        // remove consumption list nodes if not included in consumptions
        for (consumption in consumptionMap) {
            if (!Object.keys(selection.consumptions).includes(consumption)) {
                let l = consumerDiv.querySelector("[name='" + consumption + "']");
                if (l) {
                    l.remove()
                }
            }
        }

        // align base unit of quantity factor
        consumerDiv.parentNode.querySelector("label[name='quantity_unit'].data").innerHTML = selection.consumptions[Object.keys(selection.consumptions)[0]].base_unit;

        // update emissions
        updateData();

        // hide overlay
        let overlay = document.getElementById("searchConsumerOverlay");
        overlay.style.display = "none";
        rowDiv.setAttribute("data-active", false);
    });

    consumerAutoCompleteJS.input.addEventListener("focus", function(event) {
        event.stopPropagation();
    });

    /* search source overlay and auto complete */

    document.querySelectorAll("#searchSourceOverlay, div[name='source'] img.edit-icon").forEach(item => {
        item.addEventListener('click', toggleSearchSourceOverlay)
    });

    const sourceAutoCompleteJS = new autoComplete({
        placeHolder: "Search energy source ...",
        selector: "#searchSourceInput",
        searchEngine: "loose",
        data: {
            src: Object.keys(sources_json).map(key => (sources_json[key])),
            keys: ["name", "description"],
            filter: (list) => {
                const results = list.filter((item) => {
                    const itemType = item.value.type.toLowerCase();

                    let rowDiv = document.querySelector("div.row[data-active='true']");
                    let consumptionTypes = Array.from(rowDiv.querySelectorAll("div[name='consumer'] div[name='consumptions'] ul.list li")).map(li => li.getAttribute("name"));

                    // only present source items of suitable consumption type(s) if any consumption types defined
                    if (consumptionTypes.includes(itemType) || consumptionTypes.length === 0) {
                        return item.value;
                    }
                });
                return results;
            }
        },
        resultsList: {
            element: (list, data) => {
                const info = document.createElement("p");
                if (data.results.length > 0) {
                    info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
                } else {
                    info.innerHTML = `Found <strong>${data.matches.length}</strong> matching results for <strong>"${data.query}"</strong>`;
                }
                list.prepend(info);
            },
            noResults: true,
            maxResults: 30
        },
        resultItem: {
            element: (item, data) => {
                item.style = "display: block; justify-content: space-between;";
                item.innerHTML = `
                  <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                    ${data.value.name}
                  </span>  
                  <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
                    ${data.value.description}
                  </span>`;
            },
            highlight: true
        }
    });

    sourceAutoCompleteJS.input.addEventListener("selection", function(event) {

        sourceAutoCompleteJS.input.blur();
        sourceAutoCompleteJS.input.value = "";

        // get selection data
        const feedback = event.detail;
        const selection = feedback.selection.value;

        // identify active source div
        let rowDiv = document.querySelector("div.row[data-active='true']");
        let sourceDiv = rowDiv.querySelector(".data[name='source']");
        let detailsDiv = sourceDiv.querySelector("div.details");

        // not all types of emissions are available for all sources
        // refresh the list of emission types
        let emissionsTemplate = document.querySelector(".template[name='component'] div[name='emissions']").cloneNode(true);
        emissionsTemplate.style.display = "block";

        let oldEmissions = detailsDiv.querySelector("div div[name='emissions']");

        detailsDiv.removeChild(oldEmissions);
        detailsDiv.appendChild(emissionsTemplate)

        // update source data
        populateTemplate(sourceDiv, selection, "");

        // remove emission list nodes if not included in emissions
        for (unit in emissionUnitMap) {
            if (!Object.keys(selection.emissions).includes(unit)) {
                let l = sourceDiv.querySelector("[name='" + unit + "']");
                if (l) {
                    l.remove();
                }
            }
        }

        // update emissions
        updateData();

        // hide overlay
        let overlay = document.getElementById("searchSourceOverlay");
        overlay.style.display = "none";
        rowDiv.setAttribute("data-active", false);
    });

    sourceAutoCompleteJS.input.addEventListener("focus", function(event) {
        event.stopPropagation();
    });
}


// for the index creation script
try {
    module.exports = {
        totalEmissions: totalEmissions
    };
} catch(error){}
