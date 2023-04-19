# Carbon footprint modeling tool

A data model and a viewer for carbon footprint scenarios. This toolkit makes it easy to create, share and compare emission scenarios. Its purpose is to improve data quality and transparency in the field of carbon footprint quantification.

## Data model

The main features of the [data model](https://raw.githubusercontent.com/borisruf/carbon-footprint-modeling-tool/main/images/data_model.svg) are:
- A universal data scheme to model carbon emission scenarios, split by **scopes**, **consumer components** and **energy sources**
- A modular structure which allows for **nested scenarios** that can be explored and modified at different levels of detail
- Support to back consumption and emission details with **reference sources** for better transparency

![Carbon footprint scenario data model](https://raw.githubusercontent.com/borisruf/carbon-footprint-modeling-tool/main/images/data_model.svg)

## Viewer

The main features of the [viewer](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-8f35af7c-ee5b-42aa-b538-371b126b3d24) are:
- Automated **unit conversion** and **common emission type detection** to avoid data conversion errors
- Editable input fields for quantities to quickly **test the effect** of different settings
- Possibility to include different **data sources** for consumer components and energy sources
- One-click **data export** in the form of file download and **scenario sharing** via encoded URL
- **Easy deployment**: No-deployment using encoded URLs, or as serverless application (i.e. on GitHub)

<a href="https://borisruf.github.io/carbon-footprint-modeling-tool/?#eyJ0aXRsZSI6IlN0cmVhbWluZyBhIDMwLW1pbnV0ZSB2aWRlbyAoSUVBIHVwZGF0ZWQsIExhcHRvcCBhbmQgSEQpIiwicmVmZXJlbmNlX3VybCI6e30sInNjb3BlcyI6W3sibGV2ZWwiOiJTY29wZSAyIiwiZGVzY3JpcHRpb24iOnt9LCJsaXN0IjpbeyJ0eXBlIjoiY29tcG9uZW50IiwiY29uc3VtZXIiOnsibmFtZSI6IkRldmljZSAoTGFwdG9wKSIsImRlc2NyaXB0aW9uIjp7fSwiY29uc3VtcHRpb25zIjp7ImVsZWN0cmljaXR5Ijp7InZhbHVlIjoiMC4wMjIiLCJ1bml0Ijoia1doIiwiYmFzZV91bml0IjoiaHIiLCJyZWZlcmVuY2VfdXJsIjoiaHR0cHM6Ly93d3cucmVzZWFyY2hnYXRlLm5ldC9wdWJsaWNhdGlvbi8zMzU5MTEyOTVfUmVzaWRlbnRpYWxfQ29uc3VtZXJfRWxlY3Ryb25pY3NfRW5lcmd5X0NvbnN1bXB0aW9uX2luX3RoZV9Vbml0ZWRfU3RhdGVzX2luXzIwMTcifX19LCJxdWFudGl0eSI6IjAuNSIsInF1YW50aXR5X3VuaXQiOiJociIsInNvdXJjZSI6eyJuYW1lIjoiRnJhbmNlIGVsZWN0cmljaXR5IGdyaWQiLCJ0eXBlIjoiZWxlY3RyaWNpdHkiLCJkZXNjcmlwdGlvbiI6IigyMDIwKSIsImVtaXNzaW9ucyI6eyJjbzJlIjp7InZhbHVlIjoiMC4wNTExIiwidW5pdCI6ImtnIiwiYmFzZV91bml0Ijoia1doIiwicmVmZXJlbmNlX3VybCI6Imh0dHBzOi8vd3d3LmVlYS5ldXJvcGEuZXUvaW1zL2dyZWVuaG91c2UtZ2FzLWVtaXNzaW9uLWludGVuc2l0eS1vZi0xIn0sImNvMiI6eyJ2YWx1ZSI6IjAuMDU3MyIsInVuaXQiOiJrZyIsImJhc2VfdW5pdCI6ImtXaCIsInJlZmVyZW5jZV91cmwiOiJodHRwczovL3d3dy5zdGF0aXN0YS5jb20vc3RhdGlzdGljcy8xMTkwMDY3L2NhcmJvbi1pbnRlbnNpdHktb3V0bG9vay1vZi1mcmFuY2UvIn19fX1dfSx7ImxldmVsIjoiU2NvcGUgMyIsImRlc2NyaXB0aW9uIjp7fSwibGlzdCI6W3sidHlwZSI6ImNvbXBvbmVudCIsImNvbnN1bWVyIjp7Im5hbWUiOiJEYXRhIGNlbnRyZXMiLCJkZXNjcmlwdGlvbiI6e30sImNvbnN1bXB0aW9ucyI6eyJlbGVjdHJpY2l0eSI6eyJ2YWx1ZSI6IjAuMDAzNjkxMjQ3NjQyIiwidW5pdCI6ImtXaCIsImJhc2VfdW5pdCI6ImhyIiwicmVmZXJlbmNlX3VybCI6Imh0dHBzOi8vd3d3LmNhcmJvbmJyaWVmLm9yZy9mYWN0Y2hlY2std2hhdC1pcy10aGUtY2FyYm9uLWZvb3RwcmludC1vZi1zdHJlYW1pbmctdmlkZW8tb24tbmV0ZmxpeCJ9fX0sInF1YW50aXR5IjoiMC41IiwicXVhbnRpdHlfdW5pdCI6ImhyIiwic291cmNlIjp7Im5hbWUiOiJGcmFuY2UgZWxlY3RyaWNpdHkgZ3JpZCIsInR5cGUiOiJlbGVjdHJpY2l0eSIsImRlc2NyaXB0aW9uIjoiKDIwMjApIiwiZW1pc3Npb25zIjp7ImNvMmUiOnsidmFsdWUiOiIwLjA1MTEiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJrV2giLCJyZWZlcmVuY2VfdXJsIjoiaHR0cHM6Ly93d3cuZWVhLmV1cm9wYS5ldS9pbXMvZ3JlZW5ob3VzZS1nYXMtZW1pc3Npb24taW50ZW5zaXR5LW9mLTEifSwiY28yIjp7InZhbHVlIjoiMC4wNTczIiwidW5pdCI6ImtnIiwiYmFzZV91bml0Ijoia1doIiwicmVmZXJlbmNlX3VybCI6Imh0dHBzOi8vd3d3LnN0YXRpc3RhLmNvbS9zdGF0aXN0aWNzLzExOTAwNjcvY2FyYm9uLWludGVuc2l0eS1vdXRsb29rLW9mLWZyYW5jZS8ifX19fSx7InR5cGUiOiJjb21wb25lbnQiLCJjb25zdW1lciI6eyJuYW1lIjoiRGF0YSB0cmFuc21pc3Npb24gKEhEKSIsImRlc2NyaXB0aW9uIjp7fSwiY29uc3VtcHRpb25zIjp7ImVsZWN0cmljaXR5Ijp7InZhbHVlIjoiMC4wMTgzIiwidW5pdCI6ImtXaCIsImJhc2VfdW5pdCI6ImhyIiwicmVmZXJlbmNlX3VybCI6Imh0dHBzOi8vd3d3LmNhcmJvbmJyaWVmLm9yZy9mYWN0Y2hlY2std2hhdC1pcy10aGUtY2FyYm9uLWZvb3RwcmludC1vZi1zdHJlYW1pbmctdmlkZW8tb24tbmV0ZmxpeCJ9fX0sInF1YW50aXR5IjoiMC41IiwicXVhbnRpdHlfdW5pdCI6ImhyIiwic291cmNlIjp7Im5hbWUiOiJGcmFuY2UgZWxlY3RyaWNpdHkgZ3JpZCIsInR5cGUiOiJlbGVjdHJpY2l0eSIsImRlc2NyaXB0aW9uIjoiKDIwMjApIiwiZW1pc3Npb25zIjp7ImNvMmUiOnsidmFsdWUiOiIwLjA1MTEiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJrV2giLCJyZWZlcmVuY2VfdXJsIjoiaHR0cHM6Ly93d3cuZWVhLmV1cm9wYS5ldS9pbXMvZ3JlZW5ob3VzZS1nYXMtZW1pc3Npb24taW50ZW5zaXR5LW9mLTEifSwiY28yIjp7InZhbHVlIjoiMC4wNTczIiwidW5pdCI6ImtnIiwiYmFzZV91bml0Ijoia1doIiwicmVmZXJlbmNlX3VybCI6Imh0dHBzOi8vd3d3LnN0YXRpc3RhLmNvbS9zdGF0aXN0aWNzLzExOTAwNjcvY2FyYm9uLWludGVuc2l0eS1vdXRsb29rLW9mLWZyYW5jZS8ifX19fV19XX0="><img src="https://raw.githubusercontent.com/borisruf/carbon-footprint-modeling-tool/main/images/viewer.png" width="750" target="_blank"/></a>


## Usage
### View a scenario
The viewer renders the scenario data which is either stored in a JSON file that is [hosted on the server](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-95e1ade0-033c-40de-b30d-4e62f4723254), or it is [embedded in the URL](https://borisruf.github.io/carbon-footprint-modeling-tool/?#eyJ0aXRsZSI6Ik1vYmlsaXR5Iiwic2NvcGVzIjpbeyJsZXZlbCI6IlNjb3BlIDEiLCJkZXNjcmlwdGlvbiI6Iidvbi1zaXRlJyBkaXJlY3QgZW1pc3Npb25zIiwibGlzdCI6W3sidHlwZSI6ImNvbXBvbmVudCIsImNvbnN1bWVyIjp7Im5hbWUiOiJWb2xrc3dhZ2VuIEdvbGYgKDIwMTQpIiwiZGVzY3JpcHRpb24iOiJFbmdpbmUgSUQgNDUsIDQgY3lsaW5kZXJzLCBNYW51YWwgNi1zcGQiLCJjb25zdW1wdGlvbnMiOnsiZGllc2VsIjp7InZhbHVlIjoiMC4wNzM1MDQ2ODc1IiwidW5pdCI6ImwiLCJiYXNlX3VuaXQiOiJrbSIsInJlZmVyZW5jZV91cmwiOiJodHRwczovL3d3dy5mdWVsZWNvbm9teS5nb3YvIn19fSwicXVhbnRpdHkiOiIxMDAwMCIsInF1YW50aXR5X3VuaXQiOiJrbSIsInNvdXJjZSI6eyJuYW1lIjoiR2FzL0RpZXNlbCBvaWwiLCJ0eXBlIjoiZGllc2VsIiwiZGVzY3JpcHRpb24iOiIiLCJlbWlzc2lvbnMiOnsiY28yZSI6eyJ2YWx1ZSI6IjMuMjUiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJsIiwicmVmZXJlbmNlX3VybCI6Imh0dHBzOi8vYmlsYW5zLWdlcy5hZGVtZS5mci9kb2N1bWVudGF0aW9uL1VQTE9BRF9ET0NfRU4vaW5kZXguaHRtP25ld19saXF1aWRlcy5odG0ifSwiY28yIjp7InZhbHVlIjoiMi42NzY0OTIiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJsIiwicmVmZXJlbmNlX3VybCI6Imh0dHA6Ly93d3cuaXBjYy1uZ2dpcC5pZ2VzLm9yLmpwL3B1YmxpYy8yMDA2Z2wvdm9sMi5odG1sIn0sImNoNCI6eyJ2YWx1ZSI6IjAuMDAwMzYxMiIsInVuaXQiOiJrZyIsImJhc2VfdW5pdCI6ImwiLCJyZWZlcmVuY2VfdXJsIjoiaHR0cDovL3d3dy5pcGNjLW5nZ2lwLmlnZXMub3IuanAvcHVibGljLzIwMDZnbC92b2wyLmh0bWwifSwibjJvIjp7InZhbHVlIjoiMC4wMDAwMjE2NzIiLCJ1bml0Ijoia2ciLCJiYXNlX3VuaXQiOiJsIiwicmVmZXJlbmNlX3VybCI6Imh0dHA6Ly93d3cuaXBjYy1uZ2dpcC5pZ2VzLm9yLmpwL3B1YmxpYy8yMDA2Z2wvdm9sMi5odG1sIn19fX1dfV19). 
Details on consumption and emissions can be toggled by clicking on the respective title. If a data source was included, consumer components 
or energy sources can be changed by clicking the pencil icon <img src="https://raw.githubusercontent.com/borisruf/carbon-footprint-modeling-tool/main/images/pencil-square.svg" width="15"/>. The total of the emissions per scope is shown in the yellow circle on the bottom right. It is updated instantly when settings in the scenario change. The emissions of nested scenarios are calculated recursively. They can be zoomed into by clicking on their links.

Example scenarios:
- [Streaming a 30-minute video [IEA updated, UK]](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-8f35af7c-ee5b-42aa-b538-371b126b3d24) ([source](https://github.com/borisruf/carbon-footprint-modeling-tool/blob/main/scenarios/scenario-8f35af7c-ee5b-42aa-b538-371b126b3d24.json))
- [Streaming a 30-minute video [IEA updated, Laptop and HD]](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-725b3ff2-294b-4cfc-81a3-fc460ee61fdc) ([source](https://github.com/borisruf/carbon-footprint-modeling-tool/blob/main/scenarios/scenario-725b3ff2-294b-4cfc-81a3-fc460ee61fdc.json))
- [Singapore (SIN) to Paris (CDG) round-trip](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-0065da59-7785-4eed-8a11-c73b70cf798e)  ([source](https://github.com/borisruf/carbon-footprint-modeling-tool/blob/main/scenarios/scenario-0065da59-7785-4eed-8a11-c73b70cf798e.json))
- [Nested sample of personal carbon footprint](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-265789b8-d7d1-442f-ba79-e627b9226c86) ([source](https://github.com/borisruf/carbon-footprint-modeling-tool/blob/main/scenarios/scenario-265789b8-d7d1-442f-ba79-e627b9226c86.json))
- [Cargo ship emissions portfolio](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-d9de099f-a408-4526-aec2-f781c9972b42) ([source](https://github.com/borisruf/carbon-footprint-modeling-tool/blob/main/scenarios/scenario-d9de099f-a408-4526-aec2-f781c9972b42.json))
- [Monthly operation of ChatGPT](https://borisruf.github.io/carbon-footprint-modeling-tool/index.html?id=scenario-a5f20019-1f40-4f41-b2a7-f9db5346a23f) ([source](https://github.com/borisruf/carbon-footprint-modeling-tool/blob/main/scenarios/scenario-a5f20019-1f40-4f41-b2a7-f9db5346a23f.json))

---

### Create a scenario
There are two ways to compose new scenarios: Either by customizing an existing scenario in the viewer and exporting the new setting, or by writing the data structure formatted in JSON from zero.

#### 1. Extend an existing scenario (easy)
Use an existing scenario and update the quantities, consumer components and energy sources (as described [above](#view-a-scenario)). When done, export the scenario using one of the links on the bottom of the page:
  - "Save JSON" downloads the scenario as JSON file to your computer
  - "Copy JSON" downloads the scenario with a new random identifier to your computer
  - "Make URL" encodes the scenario within a URL you can use to share publicly publish it

#### 2. Create a new scenario from scratch (advanced)
Create a new JSON file following the [data scheme](https://raw.githubusercontent.com/borisruf/carbon-footprint-modeling-tool/main/images/data_model.svg). For example:
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
Assign a random identifier as file name and upload it to the "scenarios" folder of the application. Load the scenario by providing the identifier (without the .json file extension) as *id* parameter in the URL.
Example: [index.html?id=scenario-95e1ade0-033c-40de-b30d-4e62f4723254](https://borisruf.github.io/carbon-footprint-modeling-tool/?id=scenario-95e1ade0-033c-40de-b30d-4e62f4723254)

---

### Compare scenarios
The benchmark view renders a bar chart for two or more hosted scenarios identified in the URL by their ids, like `benchmark.html?ids[]=scenario-1&ids[]=scenario-2`.

<img src="https://raw.githubusercontent.com/borisruf/carbon-footprint-modeling-tool/main/images/benchmark.png" width="500"/>

Benchmark example: [2021 vs. 2022 car pool comparison](https://borisruf.github.io/carbon-footprint-modeling-tool/benchmark.html?ids[]=scenario-a03bc862-44f4-4ac6-be05-ea8ec93c1ba5&ids[]=scenario-615e4199-28fe-43d4-8b30-3cee5fe18923)


## Notes
This is a fully functional prototype, more features are in the planning. Any feedback is welcome.

## Paper reference

B. Ruf and M. Detyniecki, "[Open and Linked Data Model for Carbon Footprint Scenarios](https://borisruf.github.io/carbon-footprint-modeling-tool/ICREC2022_Open_and_Linked_Data_Model_for_Carbon_Footprint_Scenarios.pdf)", 7th International Conference on Renewable Energy and Conservation (ICREC), 2022.

## MIT License

Copyright (c) Boris Ruf

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
