-- CreateTable
CREATE TABLE "monsters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "com2us_id" INTEGER,
    "family_id" INTEGER,
    "skill_group_id" INTEGER,
    "image_filename" TEXT,
    "element" TEXT NOT NULL DEFAULT 'fire',
    "archetype" TEXT NOT NULL DEFAULT 'attack',
    "base_stars" INTEGER NOT NULL,
    "natural_stars" INTEGER NOT NULL,
    "obtainable" BOOLEAN NOT NULL DEFAULT true,
    "can_awaken" BOOLEAN NOT NULL DEFAULT true,
    "is_awakened" BOOLEAN NOT NULL DEFAULT false,
    "awaken_level" INTEGER NOT NULL DEFAULT 0,
    "awaken_bonus" TEXT,
    "awakens_from_id" INTEGER,
    "awakens_to_id" INTEGER,
    "skill_ups_to_max" INTEGER,
    "leader_skill_id" INTEGER,
    "raw_hp" INTEGER,
    "raw_attack" INTEGER,
    "raw_defense" INTEGER,
    "base_hp" INTEGER,
    "base_attack" INTEGER,
    "base_defense" INTEGER,
    "max_lvl_hp" INTEGER,
    "max_lvl_attack" INTEGER,
    "max_lvl_defense" INTEGER,
    "speed" INTEGER,
    "crit_rate" INTEGER,
    "crit_damage" INTEGER,
    "resistance" INTEGER,
    "accuracy" INTEGER,
    "awaken_mats_fire_low" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_fire_mid" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_fire_high" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_water_low" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_water_mid" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_water_high" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_wind_low" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_wind_mid" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_wind_high" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_light_low" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_light_mid" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_light_high" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_dark_low" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_dark_mid" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_dark_high" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_magic_low" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_magic_mid" INTEGER NOT NULL DEFAULT 0,
    "awaken_mats_magic_high" INTEGER NOT NULL DEFAULT 0,
    "source" BOOLEAN NOT NULL DEFAULT false,
    "farmable" BOOLEAN NOT NULL DEFAULT false,
    "fusion_food" BOOLEAN NOT NULL DEFAULT false,
    "homunculus" BOOLEAN NOT NULL DEFAULT false,
    "craft_cost" INTEGER,
    "bestiary_slug" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monsters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_sources" (
    "monster_id" INTEGER NOT NULL,
    "source_id" INTEGER NOT NULL,

    CONSTRAINT "monster_sources_pkey" PRIMARY KEY ("monster_id","source_id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slot" INTEGER NOT NULL,
    "cooltime" INTEGER,
    "hits" INTEGER NOT NULL,
    "passive" BOOLEAN NOT NULL DEFAULT false,
    "aoe" BOOLEAN NOT NULL DEFAULT false,
    "random" BOOLEAN NOT NULL DEFAULT false,
    "max_level" INTEGER NOT NULL,
    "icon_filename" TEXT,
    "level_progress_desc" TEXT,
    "multiplier_formula" TEXT,
    "multiplier_formula_raw" TEXT,
    "com2us_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_skills" (
    "monster_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "monster_skills_pkey" PRIMARY KEY ("monster_id","skill_id")
);

-- CreateTable
CREATE TABLE "skill_upgrades" (
    "id" SERIAL NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "effect" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "skill_upgrades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_scaling_stats" (
    "skill_id" INTEGER NOT NULL,
    "stat" INTEGER NOT NULL,

    CONSTRAINT "skill_scaling_stats_pkey" PRIMARY KEY ("skill_id","stat")
);

-- CreateTable
CREATE TABLE "leader_skills" (
    "id" SERIAL NOT NULL,
    "attribute" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "element" TEXT NOT NULL,

    CONSTRAINT "leader_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_effects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_filename" TEXT,
    "description" TEXT,
    "is_buff" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,

    CONSTRAINT "skill_effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon_filename" TEXT,
    "farmable_source" BOOLEAN NOT NULL DEFAULT false,
    "meta_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_effect_details" (
    "id" SERIAL NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "effect_id" INTEGER NOT NULL,
    "aoe" BOOLEAN NOT NULL DEFAULT false,
    "single_target" BOOLEAN NOT NULL DEFAULT false,
    "self_effect" BOOLEAN NOT NULL DEFAULT false,
    "chance" INTEGER,
    "on_crit" BOOLEAN NOT NULL DEFAULT false,
    "on_death" BOOLEAN NOT NULL DEFAULT false,
    "random" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER,
    "all" BOOLEAN NOT NULL DEFAULT false,
    "self_hp" BOOLEAN NOT NULL DEFAULT false,
    "target_hp" BOOLEAN NOT NULL DEFAULT false,
    "damage" INTEGER,
    "note" TEXT,

    CONSTRAINT "skill_effect_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_items" (
    "id" SERIAL NOT NULL,
    "com2us_id" INTEGER,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "category" INTEGER NOT NULL,
    "description" TEXT,
    "sell_value" INTEGER NOT NULL,

    CONSTRAINT "game_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awaken_costs" (
    "id" SERIAL NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "awaken_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_craft_costs" (
    "id" SERIAL NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "monster_craft_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "wizard_id" INTEGER,
    "wizard_name" TEXT,
    "last_import_date" TIMESTAMP(3),
    "import_source" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_monsters" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "grade" INTEGER NOT NULL DEFAULT 1,
    "awakened" BOOLEAN NOT NULL DEFAULT false,
    "skill_ups" INTEGER NOT NULL DEFAULT 0,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "com2us_id" TEXT,
    "hp" INTEGER NOT NULL DEFAULT 0,
    "attack" INTEGER NOT NULL DEFAULT 0,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "crit_rate" INTEGER NOT NULL DEFAULT 0,
    "crit_damage" INTEGER NOT NULL DEFAULT 0,
    "resistance" INTEGER NOT NULL DEFAULT 0,
    "accuracy" INTEGER NOT NULL DEFAULT 0,
    "import_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_monsters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_runes" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "equipped_monster_id" INTEGER,
    "slot" INTEGER NOT NULL,
    "set_id" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 0,
    "main_stat_type" INTEGER NOT NULL,
    "main_stat_value" INTEGER NOT NULL,
    "innate_stat_type" INTEGER,
    "innate_stat_value" INTEGER,
    "substat_1_type" INTEGER,
    "substat_1_value" INTEGER,
    "substat_2_type" INTEGER,
    "substat_2_value" INTEGER,
    "substat_3_type" INTEGER,
    "substat_3_value" INTEGER,
    "substat_4_type" INTEGER,
    "substat_4_value" INTEGER,
    "efficiency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "efficiency_max" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "com2us_id" TEXT,
    "import_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_runes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_artifacts" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "equipped_monster_id" INTEGER,
    "type" INTEGER NOT NULL,
    "element" INTEGER,
    "archetype" INTEGER,
    "grade" INTEGER NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 0,
    "main_stat_type" INTEGER NOT NULL,
    "main_stat_value" INTEGER NOT NULL,
    "substat_1_type" INTEGER,
    "substat_1_value" INTEGER,
    "substat_2_type" INTEGER,
    "substat_2_value" INTEGER,
    "substat_3_type" INTEGER,
    "substat_3_value" INTEGER,
    "substat_4_type" INTEGER,
    "substat_4_value" INTEGER,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "com2us_id" TEXT,
    "import_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monsters_com2us_id_key" ON "monsters"("com2us_id");

-- CreateIndex
CREATE INDEX "monsters_com2us_id_idx" ON "monsters"("com2us_id");

-- CreateIndex
CREATE INDEX "monsters_family_id_idx" ON "monsters"("family_id");

-- CreateIndex
CREATE INDEX "monsters_natural_stars_idx" ON "monsters"("natural_stars");

-- CreateIndex
CREATE UNIQUE INDEX "skills_com2us_id_key" ON "skills"("com2us_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_items_com2us_id_key" ON "game_items"("com2us_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_monsters_profile_id_idx" ON "user_monsters"("profile_id");

-- CreateIndex
CREATE INDEX "user_monsters_monster_id_idx" ON "user_monsters"("monster_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_monsters_profile_id_com2us_id_key" ON "user_monsters"("profile_id", "com2us_id");

-- CreateIndex
CREATE INDEX "user_runes_profile_id_idx" ON "user_runes"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_runes_profile_id_com2us_id_key" ON "user_runes"("profile_id", "com2us_id");

-- CreateIndex
CREATE INDEX "user_artifacts_profile_id_idx" ON "user_artifacts"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_artifacts_profile_id_com2us_id_key" ON "user_artifacts"("profile_id", "com2us_id");

-- AddForeignKey
ALTER TABLE "monsters" ADD CONSTRAINT "monsters_awakens_from_id_fkey" FOREIGN KEY ("awakens_from_id") REFERENCES "monsters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monsters" ADD CONSTRAINT "monsters_awakens_to_id_fkey" FOREIGN KEY ("awakens_to_id") REFERENCES "monsters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monsters" ADD CONSTRAINT "monsters_leader_skill_id_fkey" FOREIGN KEY ("leader_skill_id") REFERENCES "leader_skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_sources" ADD CONSTRAINT "monster_sources_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_sources" ADD CONSTRAINT "monster_sources_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_skills" ADD CONSTRAINT "monster_skills_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_skills" ADD CONSTRAINT "monster_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_upgrades" ADD CONSTRAINT "skill_upgrades_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_scaling_stats" ADD CONSTRAINT "skill_scaling_stats_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_effect_details" ADD CONSTRAINT "skill_effect_details_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_effect_details" ADD CONSTRAINT "skill_effect_details_effect_id_fkey" FOREIGN KEY ("effect_id") REFERENCES "skill_effects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awaken_costs" ADD CONSTRAINT "awaken_costs_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awaken_costs" ADD CONSTRAINT "awaken_costs_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "game_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_craft_costs" ADD CONSTRAINT "monster_craft_costs_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_craft_costs" ADD CONSTRAINT "monster_craft_costs_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "game_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_monsters" ADD CONSTRAINT "user_monsters_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_monsters" ADD CONSTRAINT "user_monsters_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_runes" ADD CONSTRAINT "user_runes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_runes" ADD CONSTRAINT "user_runes_equipped_monster_id_fkey" FOREIGN KEY ("equipped_monster_id") REFERENCES "user_monsters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_artifacts" ADD CONSTRAINT "user_artifacts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
