#!/usr/bin/env python
"""
Export data from Django/pushsw database
Run this in the pushsw container
"""

import os
import sys
import django
import json
from datetime import datetime

# Setup Django
sys.path.insert(0, '/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swarfarm.settings')
django.setup()

from bestiary.models import (
    Monster, Skill, LeaderSkill, SkillEffect, GameItem, Source
)
from bestiary.serializers import (
    MonsterSerializer, SkillSerializer, LeaderSkillSerializer,
    SkillEffectSerializer, GameItemSerializer
)

def export_monsters():
    """Export all monsters"""
    monsters = Monster.objects.all()
    serializer = MonsterSerializer(monsters, many=True)
    return serializer.data

def export_skills():
    """Export all skills"""
    skills = Skill.objects.all()
    serializer = SkillSerializer(skills, many=True)
    return serializer.data

def export_data():
    """Export all bestiary data"""
    print("Exporting data from Django...")
    
    data = {
        'export_date': datetime.now().isoformat(),
        'monsters': export_monsters(),
        'skills': export_skills(),
    }
    
    output_file = '/app/exported_data.json'
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Exported {len(data['monsters'])} monsters")
    print(f"Exported {len(data['skills'])} skills")
    print(f"Data saved to: {output_file}")

if __name__ == '__main__':
    export_data()

