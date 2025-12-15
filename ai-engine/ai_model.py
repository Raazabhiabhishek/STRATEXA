import sys
import json

def analyze_decision(data):
    terrain = data.get("terrain", "plain")
    weather = data.get("weather", "clear")
    threat = data.get("threatLevel", "low")

    risk_score = 0

    # Terrain impact
    if terrain == "mountain":
        risk_score += 30
    elif terrain == "forest":
        risk_score += 20
    else:
        risk_score += 10

    # Weather impact
    if weather == "fog":
        risk_score += 25
    elif weather == "rain":
        risk_score += 15
    else:
        risk_score += 5

    # Threat impact
    if threat == "high":
        risk_score += 40
    elif threat == "medium":
        risk_score += 20
    else:
        risk_score += 10

    if risk_score > 60:
        status = "HIGH RISK"
        recommendation = "Avoid operation or change route"
    elif risk_score > 30:
        status = "MEDIUM RISK"
        recommendation = "Proceed with caution and extra surveillance"
    else:
        status = "LOW RISK"
        recommendation = "Operation can proceed safely"

    return {
        "riskScore": risk_score,
        "riskStatus": status,
        "recommendation": recommendation
    }


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    result = analyze_decision(input_data)
    print(json.dumps(result))
