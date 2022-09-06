# Carbon footprint modeling tool

A **data model** and a **viewer** for carbon footprint scenarios.

## Description

This toolkit makes it easy to **create**, **share** and **compare** emission scenarios. Its purpose is to improve data quality and transparency in the field of carbon footprint quantification.

The main features of the **_data model_** are:
- A universal data scheme to model carbon emission scenarios, split by **scopes**, **consumer components** and **energy sources**
- A modular structure which allows for **nested scenarios** that can be explored and modified at different levels of detail
- Support to back consumption and emission details with **reference sources** for better transparency

The main features of the **_viewer_** are:
- Automated **unit conversion** and **common emission type detection** to avoid data conversion errors
- Editable input fields for quantities to quickly **test the effect** of different settings
- Possibility to include different **data sources** for consumer components and energy sources
- One-click **data export** in the form of file download, copy-and-paste or encoded URL
- **Easy deployment**: No-deployment using encoded URLs, or as serverless application (i.e. on GitHub)

## Usage
### View a scenario
The viewer renders the scenario data which is either stored in a JSON file that is [hosted on the server](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-95e1ade0-033c-40de-b30d-4e62f4723254), or it is [embedded in the URL](https://borisruf.github.io/carbon-footprint-modeling-tool/?#eyJ0aXRsZSI6Ik1vYmlsaXR5Iiwic2NvcGVzIjpbeyJsZXZlbCI6IlNjb3BlIDEiLCJkZXNjcmlwdGlvbiI6Iidvbi1zaXRlJyBkaXJlY3QgZW1pc3Npb25zIiwibGlzdCI6W3sidHlwZSI6ImNvbXBvbmVudCIsImNvbnN1bWVyIjp7Im5hbWUiOiJWb2xrc3dhZ2VuIEdvbGYgKDIwMTQpIiwiZGVzY3JpcHRpb24iOiJFbmdpbmUgSUQgNDUsIDQgY3lsaW5kZXJzLCBNYW51YWwgNi1zcGQiLCJjb25zdW1wdGlvbnMiOnsiZGllc2VsIjp7InZhbHVlIjoiMC4wNzM1MDQ2ODc1IiwidW5pdCI6ImwiLCJiYXNlX3VuaXQiOiJrbSIsInJlZmVyZW5jZV91cmwiOiJodHRwczovL3d3dy5mdWVsZWNvbm9teS5nb3YvIn19fSwicXVhbnRpdHkiOiIxMDAwMCIsInF1YW50aXR5X3VuaXQiOiJrbSIsInNvdXJjZSI6eyJuYW1lIjoiR2FzL0RpZXNlbCBvaWwiLCJ0eXBlIjoiZGllc2VsIiwiZGVzY3JpcHRpb24iOiIiLCJlbWlzc2lvbnMiOnsiY28yZSI6eyJ2YWx1ZSI6IjMuMjUiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJsIiwicmVmZXJlbmNlX3VybCI6Imh0dHBzOi8vYmlsYW5zLWdlcy5hZGVtZS5mci9kb2N1bWVudGF0aW9uL1VQTE9BRF9ET0NfRU4vaW5kZXguaHRtP25ld19saXF1aWRlcy5odG0ifSwiY28yIjp7InZhbHVlIjoiMi42NzY0OTIiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJsIiwicmVmZXJlbmNlX3VybCI6Imh0dHA6Ly93d3cuaXBjYy1uZ2dpcC5pZ2VzLm9yLmpwL3B1YmxpYy8yMDA2Z2wvdm9sMi5odG1sIn0sImNoNCI6eyJ2YWx1ZSI6IjAuMDAwMzYxMiIsInVuaXQiOiJrZyIsImJhc2VfdW5pdCI6ImwiLCJyZWZlcmVuY2VfdXJsIjoiaHR0cDovL3d3dy5pcGNjLW5nZ2lwLmlnZXMub3IuanAvcHVibGljLzIwMDZnbC92b2wyLmh0bWwifSwibjJvIjp7InZhbHVlIjoiMC4wMDAwMjE2NzIiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJsIiwicmVmZXJlbmNlX3VybCI6Imh0dHA6Ly93d3cuaXBjYy1uZ2dpcC5pZ2VzLm9yLmpwL3B1YmxpYy8yMDA2Z2wvdm9sMi5odG1sIn19fX1dfV19). 
Details on consumption and emissions can be toggled by clicking on the respective title. If a data source was included, consumer components 
or energy sources can be changed by clicking the pencil icon. Nested scenarios can be zoomed into by clicking on their links.

### Create a scenario
There are two ways to compose new scenarios. 

#### 1. Extend an existing scenario (easy)
Use an existing scenario and update the quantities, consumer components and energy sources (as described above). When done, export the scenario using one of the links on the bottom of the page:
  - "Save JSON" downloads the scenario as JSON file to your computer
  - "Copy JSON" downloads the scenario with a new random identifier to your computer
  - "Make URL" encodes the scenario within a URL you can use to share publicly publish it

#### 2. Create a new scenario from scratch (advanced)
Create a new JSON file following the [data scheme](https://raw.githubusercontent.com/borisruf/carbon-footprint-modeling-tool/main/images/class_diagram.png). For example:
```json
{
  "title": "Mobility",
  "scopes": [
    {
      "level": "Scope 1",
      "description": "'on-site' direct emissions",
      "list": [
        {
          "type": "component",
          "consumer": {
            "name": "Volkswagen Golf (2014)",
            "description": "Engine ID 45, 4 cylinders, Manual 6-spd",
            "consumptions": {
              "diesel": {
                "value": "0.0735046875",
                "unit": "l",
                "base_unit": "km",
                "reference_url": "https://www.fueleconomy.gov/"
              }
            }
          },
          "quantity": "10000",
          "quantity_unit": "km",
          "source": {
            "name": "Gas/Diesel oil",
            "type": "diesel",
            "description": "",
            "emissions": {
              "co2e": {
                "value": "3.25",
                "unit": "kg",
                "base_unit": "l",
                "reference_url": "https://bilans-ges.ademe.fr/documentation/UPLOAD_DOC_EN/index.htm?new_liquides.htm"
              }
            }
          }
        }
      ]
    }
  ]
}
``` 
Assign a random identifier as file name and upload it to the "scenarios" folder of the application. Load the scenario by providing the identifier (without the .json file extension) as id parameter in the URL.
Example: [index.html?id=scenario-95e1ade0-033c-40de-b30d-4e62f4723254](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-95e1ade0-033c-40de-b30d-4e62f4723254)

### Compare scenarios
The benchmark view takes two or more identifiers of hosted scenarios as parameters and renders a bar chart. 

[benchmark.html?ids[]=scenario-a03bc862-44f4-4ac6-be05-ea8ec93c1ba5&ids[]=scenario-615e4199-28fe-43d4-8b30-3cee5fe18923](https://borisruf.github.io/carbon-footprint-modeling-tool/benchmark.html?ids[]=scenario-a03bc862-44f4-4ac6-be05-ea8ec93c1ba5&ids[]=scenario-615e4199-28fe-43d4-8b30-3cee5fe18923)
