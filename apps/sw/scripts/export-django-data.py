#!/usr/bin/env python3
"""
Export data from Django/pushsw database
This will export all bestiary data to JSON format

Usage (in pushsw container):
docker compose exec swarfarm python /app/scripts/export_django_data.py
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
    MonsterSerializer
)

def export_to_json():
    """Export all data to JSON file"""
    print("Starting data export from Django...")
    print("=" * 50)
    
    # Export Monsters
    print("Exporting Monsters...")
    monsters = Monster.objects.all().order_by('id')
    monster_data = []
    
    for monster in monsters:
        try:
            data = {
                'id': monster.id,
                'name': monster.name,
                'com2us_id': monster.com2us_id,
                'family_id': monster.family_id,
                'image_filename': monster.image_filename,
                'element': monster.element,
                'archetype': monster.archetype,
                'base_stars': monster.base_stars,
                'natural_stars': monster.natural_stars,
                'obtainable': monster.obtainable,
                'can_awaken': monster.can_awaken,
                'is_awakened': monster.is_awakened,
                'awaken_level': monster.awaken_level,
                'awaken_bonus': monster.awaken_bonus,
                'awakens_from_id': monster.awakens_from_id,
                'awakens_to_id': monster.awakens_to_id,
                'skill_ups_to_max': monster.skill_ups_to_max,
                'leader_skill_id': monster.leader_skill_id if monster.leader_skill else None,
                
                # Stats
                'raw_hp': monster.raw_hp,
                'raw_attack': monster.raw_attack,
                'raw_defense': monster.raw_defense,
                'base_hp': monster.base_hp,
                'base_attack': monster.base_attack,
                'base_defense': monster.base_defense,
                'max_lvl_hp': monster.max_lvl_hp,
                'max_lvl_attack': monster.max_lvl_attack,
                'max_lvl_defense': monster.max_lvl_defense,
                'speed': monster.speed,
                'crit_rate': monster.crit_rate,
                'crit_damage': monster.crit_damage,
                'resistance': monster.resistance,
                'accuracy': monster.accuracy,
                
                # Awakening materials
                'awaken_mats_fire_low': monster.awaken_mats_fire_low,
                'awaken_mats_fire_mid': monster.awaken_mats_fire_mid,
                'awaken_mats_fire_high': monster.awaken_mats_fire_high,
                'awaken_mats_water_low': monster.awaken_mats_water_low,
                'awaken_mats_water_mid': monster.awaken_mats_water_mid,
                'awaken_mats_water_high': monster.awaken_mats_water_high,
                'awaken_mats_wind_low': monster.awaken_mats_wind_low,
                'awaken_mats_wind_mid': monster.awaken_mats_wind_mid,
                'awaken_mats_wind_high': monster.awaken_mats_wind_high,
                'awaken_mats_light_low': monster.awaken_mats_light_low,
                'awaken_mats_light_mid': monster.awaken_mats_light_mid,
                'awaken_mats_light_high': monster.awaken_mats_light_high,
                'awaken_mats_dark_low': monster.awaken_mats_dark_low,
                'awaken_mats_dark_mid': monster.awaken_mats_dark_mid,
                'awaken_mats_dark_high': monster.awaken_mats_dark_high,
                'awaken_mats_magic_low': monster.awaken_mats_magic_low,
                'awaken_mats_magic_mid': monster.awaken_mats_magic_mid,
                'awaken_mats_magic_high': monster.awaken_mats_magic_high,
                
                'source': monster.source,
                'farmable': monster.farmable,
                'fusion_food': monster.fusion_food,
                'homunculus': monster.homunculus,
                'craft_cost': monster.craft_cost,
                'bestiary_slug': monster.bestiary_slug,
                
                # Relations
                'skill_ids': list(monster.skills.values_list('id', flat=True)),
                'awakencost_ids': list(monster.awakencost_set.values_list('item_id', 'quantity')),
            }
            monster_data.append(data)
        except Exception as e:
            print(f"Error exporting monster {monster.id}: {e}")
    
    print(f"✓ Exported {len(monster_data)} monsters")
    
    # Export Skills
    print("\nExporting Skills...")
    skills = Skill.objects.all().order_by('id')
    skill_data = []
    
    for skill in skills:
        try:
            data = {
                'id': skill.id,
                'com2us_id': skill.com2us_id,
                'name': skill.name,
                'description': skill.description,
                'slot': skill.slot,
                'cooltime': skill.cooltime,
                'hits': skill.hits,
                'passive': skill.passive,
                'aoe': skill.aoe,
                'random': skill.random,
                'max_level': skill.max_level,
                'icon_filename': skill.icon_filename,
                'level_progress_description': skill.level_progress_description,
                'multiplier_formula': skill.multiplier_formula,
                'multiplier_formula_raw': skill.multiplier_formula_raw,
            }
            skill_data.append(data)
        except Exception as e:
            print(f"Error exporting skill {skill.id}: {e}")
    
    print(f"✓ Exported {len(skill_data)} skills")
    
    # Export Leader Skills
    print("\nExporting Leader Skills...")
    leader_skills = LeaderSkill.objects.all()
    leader_skill_data = []
    
    for ls in leader_skills:
        data = {
            'id': ls.id,
            'attribute': ls.attribute,
            'amount': ls.amount,
            'area': ls.area,
            'element': ls.element,
        }
        leader_skill_data.append(data)
    
    print(f"✓ Exported {len(leader_skill_data)} leader skills")
    
    # Export Game Items
    print("\nExporting Game Items...")
    items = GameItem.objects.all()
    item_data = []
    
    for item in items:
        data = {
            'id': item.id,
            'com2us_id': item.com2us_id,
            'name': item.name,
            'icon': item.icon,
            'category': item.category,
            'description': item.description,
            'sell_value': item.sell_value,
        }
        item_data.append(data)
    
    print(f"✓ Exported {len(item_data)} items")
    
    # Combine all data
    export_data = {
        'export_date': datetime.now().isoformat(),
        'version': '1.0',
        'data': {
            'monsters': monster_data,
            'skills': skill_data,
            'leader_skills': leader_skill_data,
            'game_items': item_data,
        },
        'statistics': {
            'total_monsters': len(monster_data),
            'total_skills': len(skill_data),
            'total_leader_skills': len(leader_skill_data),
            'total_items': len(item_data),
        }
    }
    
    # Save to file
    output_file = '/app/exported_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 50)
    print(f"✓ Export complete!")
    print(f"✓ Data saved to: {output_file}")
    print(f"✓ Total size: {os.path.getsize(output_file)} bytes")
    print("=" * 50)

if __name__ == '__main__':
    export_to_json()

