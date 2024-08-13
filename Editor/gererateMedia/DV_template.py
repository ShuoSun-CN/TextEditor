import json


def pie_option(data):
    data_dict = []
    for l, v in zip(data[0], data[1]):
        dic = {"value": v, "name": l}
        data_dict.append(dic)

    option_first = """{
          "tooltip": {
            "trigger": "item"
          },
          "legend": {
            "orient": "vertical",
            "left": "left"
          },
          "series": [
            {
              "name": "Access From",
              "type": "pie",
              "radius": "60%",
              "data": 
        """

    option_last = """ ,
                  "label": {
                    "normal": {
                    "position": "inside",
                      "show": true,
                      "formatter": "{c}\\n{d}%"
                    }
                  },
                  "emphasis": {
                    "itemStyle": {
                      "shadowBlur": 10,
                      "shadowOffsetX": 0,
                      "shadowColor": "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            }"""
    result=option_first+json.dumps(data_dict)+option_last
    return result
def bar_option(data):
    op_first="""
    {
        "xAxis": {
            "type": "category",
            "data": 
            """


    op_second="""},
        "yAxis": {
            "type": "value"
        },
        "series": [
            {
            "itemStyle" : { "normal": {"label" : {"show": true}}},
                "data": """

    op_third=""","type": "bar"
            }
        ]
    }"""
    return op_first+json.dumps(list(data[0]))+op_second+json.dumps(list(data[1]))+op_third
def line_option(data):
    op_first="""
    {
        "xAxis": {
            "type": "category",
            "data": 
            """


    op_second="""},
        "yAxis": {
            "type": "value"
        },
        "series": [
            {
            "itemStyle" : { "normal": {"label" : {"show": true}}},
                "data": """

    op_third=""","type": "line"
            }
        ]
    }"""
    return op_first+json.dumps(list(data[0]))+op_second+json.dumps(list(data[1]))+op_third

def get_option_by_task(data,task):
    if task=="pie":
        return pie_option(data)
    if task=="bar":
        return bar_option(data)
    if task=="line":
        return line_option(data)