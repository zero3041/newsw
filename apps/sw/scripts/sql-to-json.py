#!/usr/bin/env python3
"""
Convert PostgreSQL SQL dump to JSON format
Parse the SQL backup and extract data to clean JSON
"""

import re
import json
import sys
from pathlib import Path

def parse_null_value(value):
    """Convert escape N to None"""
    if value == '\\N' or value == '':
        return None
    return value

def parse_boolean(value):
    """Convert t/f to boolean"""
    if value == 't':
        return True
    if value == 'f':
        return False
    return value

def parse_value(value):
    """Parse a value (string, int, bool, null)"""
    if value == '\\N' or value == '':
        return None
    if value == 't':
        return True
    if value == 'f':
        return False
    if value.replace('.', '').replace('-', '').isdigit():
        try:
            if '.' in value:
                return float(value)
            return int(value)
        except:
            return value
    return value

def extract_table_data(content: str, table_name: str):
    """Extract data from COPY statement"""
    pattern = rf"COPY public\.{table_name}\s+\(([^\)]+)\)\s+FROM stdin;([^\\\\]+)\\\\\.$"
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        return []
    
    columns = [col.strip().strip('"') for col in match.group(1).split(',')]
    data_lines = match.group(2).strip().split('\n')
    
    results = []
    for line in data_lines:
        if not line or line.strip() == '':
            continue
            
        # Split by tab
        values = line.split('\t')
        
        # Parse each value
        parsed_values = []
        for val in values:
            parsed_values.append(parse_value(val))
        
        if len(parsed_values) == len(columns):
            record = dict(zip(columns, parsed_values))
            results.append(record)
    
    return results

def main():
    sql_file = sys.argv[1] if len(sys.argv) > 1 else '../../../pushsw/backup_full_20251027_170316.sql'
    
    print(f"Reading SQL file: {sql_file}")
    
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Extracting tables...")
    
    # Extract bestiary tables
    tables = {}
    
    # Monsters
    print("  - Extracting monsters...")
    monsters = extract_table_data(content, 'bestiary_monster')
    print(f"    Found {len(monsters)} monsters")
    tables['monsters'] = monsters
    
    # Skills
    print("  - Extracting skills...")
    skills = extract_table_data(content, 'bestiary_skill')
    print(f"    Found {len(skills)} skills")
    tables['skills'] = skills
    
    # Leader Skills
    print("  - Extracting leader skills...")
    leader_skills = extract_table_data(content, 'bestiary_leaderskill')
    print(f"    Found {len(leader_skills)} leader skills")
    tables['leader_skills'] = leader_skills
    
    # Game Items
    print("  - Extracting game items...")
    items = extract_table_data(content, 'bestiary_gameitem')
    print(f"    Found {len(items)} game items")
    tables['game_items'] = items
    
    # Monster Skills (junction table)
    print("  - Extracting monster_skills...")
    monster_skills = extract_table_data(content, 'bestiary_monster_skills')
    print(f"    Found {len(monster_skills)} monster skills")
    tables['monster_skills'] = monster_skills
    
    # Awaken Costs
    print("  - Extracting awaken costs...")
    awaken_costs = extract_table_data(content, 'bestiary_awakencost')
    print(f"    Found {len(awaken_costs)} awaken costs")
    tables['awaken_costs'] = awaken_costs
    
    # Save to JSON
    output_file = 'exported_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(tables, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Export complete!")
    print(f"✓ Output file: {output_file}")
    print(f"✓ File size: {Path(output_file).stat().st_size / 1024 / 1024:.2f} MB")
    
    # Print summary
    total = sum(len(v) for v in tables.values())
    print(f"\nSummary:")
    print(f"  Total records: {total}")
    for table_name, records in tables.items():
        print(f"  {table_name}: {len(records)}")

if __name__ == '__main__':
    main()
