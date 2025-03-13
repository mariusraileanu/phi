import random
import json
import math
from typing import List, Dict, Any, Tuple

# Define Abu Dhabi districts
districts = [
    {"name": "Al Danah", "center": [24.4869, 54.3702], "population": 120000},
    {"name": "Al Bateen", "center": [24.4639, 54.3346], "population": 85000},
    {"name": "Al Zahiyah", "center": [24.4989, 54.3680], "population": 95000},
    {"name": "Al Maryah Island", "center": [24.4999, 54.3889], "population": 65000},
    {"name": "Al Reem Island", "center": [24.5019, 54.4020], "population": 110000},
    {"name": "Al Khalidiyah", "center": [24.4639, 54.3502], "population": 130000},
    {"name": "Al Mushrif", "center": [24.4469, 54.3902], "population": 105000},
    {"name": "Corniche", "center": [24.4689, 54.3230], "population": 75000},
    {"name": "Yas Island", "center": [24.4999, 54.6050], "population": 45000},
    {"name": "Saadiyat Island", "center": [24.5389, 54.4230], "population": 55000}
]

# Generate district boundaries (simplified GeoJSON)
def generate_district_boundaries():
    features = []
    
    for district in districts:
        center = district["center"]
        # Create a simple polygon around the center point
        radius = random.uniform(0.01, 0.025)  # Roughly 1-2.5 km
        points = 8  # Number of points in the polygon
        
        coordinates = []
        for i in range(points):
            angle = (2 * math.pi * i) / points
            # Add some randomness to make the shape irregular
            jitter = random.uniform(0.7, 1.3)
            lat = center[0] + (radius * jitter * math.cos(angle))
            lng = center[1] + (radius * jitter * math.sin(angle))
            coordinates.append([lng, lat])  # GeoJSON uses [lng, lat] order
        
        # Close the polygon
        coordinates.append(coordinates[0])
        
        feature = {
            "type": "Feature",
            "properties": {
                "name": district["name"],
                "population": district["population"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [coordinates]
            }
        }
        features.append(feature)
    
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    with open("src/data/synthetic/district_boundaries.json", "w") as f:
        json.dump(geojson, f, indent=2)
    
    return geojson

# Generate BMI data for heatmap
def generate_bmi_data():
    bmi_points = []
    
    # For each district, generate multiple BMI data points
    for district in districts:
        center = district["center"]
        # Number of points proportional to population
        num_points = max(20, int(district["population"] / 5000))
        
        # Base BMI varies by district to create hotspots
        base_bmi = random.uniform(24.5, 28.5)
        
        for _ in range(num_points):
            # Random point within district
            lat_offset = random.uniform(-0.015, 0.015)
            lng_offset = random.uniform(-0.015, 0.015)
            lat = center[0] + lat_offset
            lng = center[1] + lng_offset
            
            # BMI with some variation
            bmi = base_bmi + random.uniform(-2.0, 2.0)
            # Intensity for heatmap (normalized 0-1)
            intensity = (bmi - 18.5) / 15  # Normalize BMI range
            intensity = max(0.1, min(1.0, intensity))  # Clamp between 0.1 and 1.0
            
            bmi_points.append({
                "lat": lat,
                "lng": lng,
                "bmi": round(bmi, 1),
                "intensity": round(intensity, 2)
            })
    
    # Convert to format needed for heatmap
    heatmap_data = [[p["lat"], p["lng"], p["intensity"]] for p in bmi_points]
    
    with open("src/data/synthetic/bmi_data.json", "w") as f:
        json.dump({
            "points": bmi_points,
            "heatmap": heatmap_data
        }, f, indent=2)
    
    return bmi_points

# Generate healthcare facilities
def generate_healthcare_facilities():
    facility_types = [
        {"type": "hospital", "count": 8},
        {"type": "clinic", "count": 15},
        {"type": "gym", "count": 20},
        {"type": "park", "count": 12},
        {"type": "screening", "count": 10}
    ]
    
    facilities = []
    
    for facility in facility_types:
        for i in range(facility["count"]):
            # Pick a random district
            district = random.choice(districts)
            center = district["center"]
            
            # Random position near district center
            lat_offset = random.uniform(-0.02, 0.02)
            lng_offset = random.uniform(-0.02, 0.02)
            lat = center[0] + lat_offset
            lng = center[1] + lng_offset
            
            facility_type = facility["type"]
            
            # Generate appropriate name based on type
            if facility_type == "hospital":
                name = f"{district['name']} General Hospital" if i % 3 == 0 else f"Medical Center {i+1}"
            elif facility_type == "clinic":
                name = f"{district['name']} Clinic" if i % 3 == 0 else f"Health Center {i+1}"
            elif facility_type == "gym":
                name = f"Fitness Club {i+1}"
            elif facility_type == "park":
                name = f"{district['name']} Park" if i % 3 == 0 else f"Green Space {i+1}"
            elif facility_type == "screening":
                name = f"Cancer Screening Center {i+1}"
            else:
                name = f"Facility {i+1}"
            
            facilities.append({
                "id": f"{facility_type}_{i+1}",
                "name": name,
                "type": facility_type,
                "position": [lat, lng],
                "district": district["name"],
                "description": f"A {facility_type} facility in {district['name']}"
            })
    
    with open("src/data/synthetic/healthcare_facilities.json", "w") as f:
        json.dump(facilities, f, indent=2)
    
    return facilities

# Generate health campaigns
def generate_health_campaigns():
    campaigns = [
        {
            "id": "campaign_1",
            "name": "Mental Health Awareness",
            "description": "Campaign to raise awareness about mental health issues",
            "startDate": "2025-01-15",
            "endDate": "2025-04-15",
            "districts": random.sample([d["name"] for d in districts], 5),
            "type": "awareness"
        },
        {
            "id": "campaign_2",
            "name": "One Billion Steps Challenge",
            "description": "Community fitness challenge to promote physical activity",
            "startDate": "2025-02-01",
            "endDate": "2025-05-01",
            "districts": random.sample([d["name"] for d in districts], 7),
            "type": "fitness"
        },
        {
            "id": "campaign_3",
            "name": "Diabetes Prevention Program",
            "description": "Educational campaign for diabetes prevention",
            "startDate": "2025-03-10",
            "endDate": "2025-06-10",
            "districts": random.sample([d["name"] for d in districts], 6),
            "type": "education"
        },
        {
            "id": "campaign_4",
            "name": "Cancer Screening Drive",
            "description": "Initiative to increase participation in cancer screening",
            "startDate": "2025-02-15",
            "endDate": "2025-05-15",
            "districts": random.sample([d["name"] for d in districts], 8),
            "type": "screening"
        },
        {
            "id": "campaign_5",
            "name": "Healthy Eating Initiative",
            "description": "Program to promote nutritious eating habits",
            "startDate": "2025-01-20",
            "endDate": "2025-04-20",
            "districts": random.sample([d["name"] for d in districts], 4),
            "type": "nutrition"
        }
    ]
    
    with open("src/data/synthetic/health_campaigns.json", "w") as f:
        json.dump(campaigns, f, indent=2)
    
    return campaigns

# Generate cancer screening data
def generate_cancer_screening_data():
    cancer_types = ["Breast", "Colorectal", "Lung", "Prostate", "Cervical"]
    age_groups = ["18-25", "26-34", "35-44", "45-54", "55-64", "65+"]
    
    # Generate screening participation rates by district
    district_screening = []
    
    for district in districts:
        # Base participation rate varies by district
        base_rate = random.uniform(0.3, 0.7)
        
        district_data = {
            "district": district["name"],
            "overall_participation": round(base_rate, 2),
            "cancer_types": {},
            "age_groups": {},
            "eligible_count": int(district["population"] * 0.4),  # 40% of population eligible
            "screened_count": int(district["population"] * 0.4 * base_rate)
        }
        
        # Participation by cancer type
        for cancer in cancer_types:
            # Vary participation by cancer type
            type_rate = base_rate * random.uniform(0.7, 1.3)
            type_rate = min(1.0, max(0.1, type_rate))  # Clamp between 0.1 and 1.0
            district_data["cancer_types"][cancer] = round(type_rate, 2)
        
        # Participation by age group
        for age in age_groups:
            # Vary participation by age group
            age_rate = base_rate * random.uniform(0.7, 1.3)
            age_rate = min(1.0, max(0.1, age_rate))  # Clamp between 0.1 and 1.0
            district_data["age_groups"][age] = round(age_rate, 2)
        
        district_screening.append(district_data)
    
    # Generate eligible individuals data (synthetic)
    eligible_individuals = []
    
    for district in districts:
        # Number of eligible individuals proportional to population
        num_eligible = int(district["population"] * 0.4)  # 40% of population eligible
        
        for i in range(min(100, num_eligible)):  # Limit to 100 per district for demo
            # Random cancer type and age group
            cancer_type = random.choice(cancer_types)
            age_group = random.choice(age_groups)
            
            # Determine if screened based on district participation rate
            district_data = next(d for d in district_screening if d["district"] == district["name"])
            type_rate = district_data["cancer_types"][cancer_type]
            age_rate = district_data["age_groups"][age_group]
            
            # Average of type and age rates
            screened_probability = (type_rate + age_rate) / 2
            screened = random.random() < screened_probability
            
            eligible_individuals.append({
                "id": f"patient_{district['name'].replace(' ', '_')}_{i+1}",
                "district": district["name"],
                "age_group": age_group,
                "eligible_for": cancer_type,
                "screened": screened,
                "screening_date": "2025-01-15" if screened else None
            })
    
    # Save data
    with open("src/data/synthetic/cancer_screening.json", "w") as f:
        json.dump({
            "district_screening": district_screening,
            "eligible_individuals": eligible_individuals,
            "cancer_types": cancer_types,
            "age_groups": age_groups
        }, f, indent=2)
    
    return {
        "district_screening": district_screening,
        "eligible_individuals": eligible_individuals
    }

# Generate hotspots data
def generate_hotspots_data():
    hotspot_types = ["obesity", "screening"]
    risk_levels = ["high", "medium", "low"]
    
    hotspots = []
    
    # Create obesity hotspots
    for i in range(5):
        district = random.choice(districts)
        center = district["center"]
        
        # Random position near district center
        lat_offset = random.uniform(-0.01, 0.01)
        lng_offset = random.uniform(-0.01, 0.01)
        lat = center[0] + lat_offset
        lng = center[1] + lng_offset
        
        # Random radius between 300-800 meters
        radius = random.uniform(300, 800)
        
        # Risk level
        risk = risk_levels[0] if i < 2 else (risk_levels[1] if i < 4 else risk_levels[2])
        
        # Generate insights based on type and risk
        insights = []
        if risk == "high":
            insights.append(f"This area has an obesity rate {random.randint(5, 10)}% higher than the city average.")
            insights.append(f"Only {random.randint(10, 30)}% of residents report regular physical activity.")
        elif risk == "medium":
            insights.append(f"This area has an obesity rate {random.randint(2, 4)}% higher than the city average.")
            insights.append(f"{random.randint(30, 50)}% of residents report regular physical activity.")
        else:
            insights.append(f"This area has an obesity rate close to the city average.")
            insights.append(f"{random.randint(50, 70)}% of residents report regular physical activity.")
        
        hotspots.append({
            "id": f"obesity_hotspot_{i+1}",
            "position": [lat, lng],
            "radius": radius,
            "type": "obesity",
            "name": f"{district['name']} Obesity Hotspot",
            "insights": insights,
            "riskLevel": risk,
            "district": district["name"]
        })
    
    # Create screening hotspots
    for i in range(5):
        district = random.choice(districts)
        center = district["center"]
        
        # Random position near district center
        lat_offset = random.uniform(-0.01, 0.01)
        lng_offset = random.uniform(-0.01, 0.01)
        lat = center[0] + lat_offset
        lng = center[1] + lng_offset
        
        # Random radius between 300-800 meters
        radius = random.uniform(300, 800)
        
        # Risk level
        risk = risk_levels[0] if i < 2 else (risk_levels[1] if i < 4 else risk_levels[2])
        
        # Generate insights based on type and risk
        insights = []
        if risk == "high":
            insights.append(f"This area has a low screening participation rate of only {random.randint(20, 35)}%.")
            insights.append(f"There are approximately {random.randint(100, 300)} eligible individuals who have not been screened.")
        elif risk == "medium":
            insights.append(f"This area has a moderate screening participation rate of {random.randint(35, 50)}%.")
            insights.append(f"There are approximately {random.randint(50, 100)} eligible individuals who have not been screened.")
        else:
            insights.append(f"This area has a good screening participation rate of {random.randint(50, 70)}%.")
            insights.append(f"There are approximately {random.randint(10, 50)} eligible individuals who have not been screened.")
        
        hotspots.append({
            "id": f"screening_hotspot_{i+1}",
            "position": [lat, lng],
            "radius": radius,
            "type": "screening",
            "name": f"{district['name']} Screening Hotspot",
            "insights": insights,
            "riskLevel": risk,
            "district": district["name"]
        })
    
    with open("src/data/synthetic/hotspots.json", "w") as f:
        json.dump(hotspots, f, indent=2)
    
    return hotspots

# Generate demographic data
def generate_demographic_data():
    demographics = []
    
    for district in districts:
        # Population density (people per km²)
        density = random.randint(2000, 15000)
        
        # National vs Expatriate ratio
        national_percent = random.randint(15, 40)
        expat_percent = 100 - national_percent
        
        # Gender distribution
        male_percent = random.randint(45, 60)
        female_percent = 100 - male_percent
        
        # Age distribution
        age_groups = [
            {"label": "18-25", "value": random.randint(10, 20)},
            {"label": "26-34", "value": random.randint(20, 30)},
            {"label": "35-44", "value": random.randint(15, 25)},
            {"label": "45-54", "value": random.randint(10, 20)},
            {"label": "55-64", "value": random.randint(5, 15)},
            {"label": "65+", "value": random.randint(5, 10)}
        ]
        
        # Normalize age groups to sum to 100%
        total = sum(group["value"] for group in age_groups)
        for group in age_groups:
            group["value"] = round((group["value"] / total) * 100)
        
        # Ensure they sum to 100 after rounding
        diff = 100 - sum(group["value"] for group in age_groups)
        age_groups[0]["value"] += diff
        
        demographics.append({
            "district": district["name"],
            "population": district["population"],
            "density": density,
            "nationalVsExpat": {
                "national": national_percent,
                "expat": expat_percent
            },
            "genderDistribution": {
                "male": male_percent,
                "female": female_percent
            },
            "ageGroups": age_groups
        })
    
    with open("src/data/synthetic/demographics.json", "w") as f:
        json.dump(demographics, f, indent=2)
    
    return demographics

# Main function to generate all data
def generate_all_data():
    print("Generating district boundaries...")
    generate_district_boundaries()
    
    print("Generating BMI data...")
    generate_bmi_data()
    
    print("Generating healthcare facilities...")
    generate_healthcare_facilities()
    
    print("Generating health campaigns...")
    generate_health_campaigns()
    
    print("Generating cancer screening data...")
    generate_cancer_screening_data()
    
    print("Generating hotspots data...")
    generate_hotspots_data()
    
    print("Generating demographic data...")
    generate_demographic_data()
    
    print("All synthetic data generated successfully!")

if __name__ == "__main__":
    generate_all_data()
