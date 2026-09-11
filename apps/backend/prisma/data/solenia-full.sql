--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Breed; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Breed" AS ENUM (
    'ELFE',
    'HALFELIN',
    'HUMAIN',
    'NAIN',
    'DEMI_ELFE',
    'DEMI_ORC',
    'DRAKEIDE',
    'GNOME',
    'TIEFFELIN',
    'AASIMAR',
    'GENASIAIR',
    'GENASITERRE',
    'GENASIFEUR',
    'GENASIEAU',
    'GOLIATH',
    'OTHER'
);


--
-- Name: CombatStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CombatStatus" AS ENUM (
    'ACTIVE',
    'FINISHED'
);


--
-- Name: DnDAlignment; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DnDAlignment" AS ENUM (
    'LOYAL_BON',
    'NEUTRE_BON',
    'CHAOTIQUE_BON',
    'LOYAL_NEUTRE',
    'VRAI_NEUTRE',
    'CHAOTIQUE_NEUTRE',
    'LOYAL_MAUVAIS',
    'NEUTRE_MAUVAIS',
    'CHAOTIQUE_MAUVAIS'
);


--
-- Name: DnDClass; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DnDClass" AS ENUM (
    'BARBARE',
    'BARDE',
    'CLERC',
    'DRUIDE',
    'GUERRIER',
    'MOINE',
    'PALADIN',
    'RODEUR',
    'ROUBLARD',
    'ENSORCELEUR',
    'SORCIER',
    'MAGICIEN',
    'ARTIFICIER',
    'OTHER'
);


--
-- Name: Language; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Language" AS ENUM (
    'COMMUN',
    'NAIN',
    'ELFIQUE',
    'GNOME',
    'HALFELIN',
    'ORC',
    'GOBELIN',
    'GEANT',
    'DRACONIQUE',
    'SYLVESTRE',
    'INFERNAL',
    'ABYSSAL',
    'CELESTE',
    'PRIMORDIAL',
    'AQUAN',
    'AURAN',
    'IGNAN',
    'TERRAN',
    'PROFOND',
    'SLAADI',
    'TELEPATHIQUE',
    'ARGOT_VOLEUR'
);


--
-- Name: Membership; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Membership" AS ENUM (
    'POLITIC',
    'RELIGEUX',
    'MARCHAND',
    'MILITAIRE',
    'CRIMINALITE',
    'OTHER'
);


--
-- Name: OrganisationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrganisationType" AS ENUM (
    'CELLULE',
    'PRINCIPAL',
    'FAMILLE'
);


--
-- Name: PlaceType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PlaceType" AS ENUM (
    'MAGASIN',
    'TAVERNE_AUBERGE',
    'MAGASIN_MAGIE',
    'HERBORISTE_APOTHICAIRE',
    'AUTRE',
    'DONJON_CAVERNE'
);


--
-- Name: QuestStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."QuestStatus" AS ENUM (
    'A_FAIRE',
    'EN_COURS',
    'TERMINEE',
    'ECHOUEE'
);


--
-- Name: QuestStepStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."QuestStepStatus" AS ENUM (
    'A_FAIRE',
    'EN_COURS',
    'FAITE'
);


--
-- Name: Sex; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Sex" AS ENUM (
    'MAN',
    'WOMAN',
    'OTHER'
);


--
-- Name: UserType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserType" AS ENUM (
    'admin',
    'editor',
    'viewer'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Campaign; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Campaign" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    color text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: City; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."City" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "kingdomId" text,
    "iconUrl" text,
    "isForDM" boolean DEFAULT false NOT NULL,
    flag text,
    map text
);


--
-- Name: Combat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Combat" (
    id text NOT NULL,
    name text NOT NULL,
    round integer DEFAULT 1 NOT NULL,
    "activeTurnIndex" integer DEFAULT 0 NOT NULL,
    status public."CombatStatus" DEFAULT 'ACTIVE'::public."CombatStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "questStepId" text
);


--
-- Name: Combatant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Combatant" (
    id text NOT NULL,
    "combatId" text NOT NULL,
    name text NOT NULL,
    "playerCharacterId" text,
    "personId" text,
    "initiativeRoll" integer DEFAULT 0 NOT NULL,
    "currentHp" integer DEFAULT 0 NOT NULL,
    "maxHp" integer DEFAULT 0 NOT NULL,
    ca integer,
    conditions text[] DEFAULT ARRAY[]::text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    description text NOT NULL,
    "dateInGame" timestamp(3) without time zone,
    "kingdomId" text,
    "cityId" text,
    "placeId" text,
    "personOfInterestId" text,
    "authorId" text,
    "districtId" text
);


--
-- Name: District; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."District" (
    id text NOT NULL,
    name text NOT NULL,
    motto text,
    content text,
    ambiance text,
    rumors text,
    secret text,
    "cityId" text NOT NULL
);


--
-- Name: FamilyMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FamilyMember" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    name text NOT NULL,
    title text,
    "personId" text,
    "playerCharacterId" text,
    "fatherId" text,
    "motherId" text,
    "spouseId" text,
    sex public."Sex",
    "isFounder" boolean DEFAULT false NOT NULL,
    generation integer,
    "order" integer DEFAULT 0 NOT NULL,
    notes text,
    "isForDM" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "superiorId" text
);


--
-- Name: GameSession; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GameSession" (
    id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    title text,
    summary text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "campaignId" text
);


--
-- Name: Kingdom; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Kingdom" (
    id text NOT NULL,
    name text NOT NULL,
    population integer,
    description text,
    "dateInGame" timestamp(3) without time zone,
    color text,
    "isForDM" boolean DEFAULT false NOT NULL,
    flag text,
    "borderPoints" jsonb
);


--
-- Name: Lore; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Lore" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "dateInGame" text,
    summary text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isForDM" boolean DEFAULT false NOT NULL,
    tags text[] DEFAULT ARRAY[]::text[] NOT NULL
);


--
-- Name: LoreCity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LoreCity" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "cityId" text NOT NULL
);


--
-- Name: LoreKingdom; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LoreKingdom" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "kingdomId" text NOT NULL
);


--
-- Name: LoreOrganisation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LoreOrganisation" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "organisationId" text NOT NULL
);


--
-- Name: LorePerson; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LorePerson" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "personId" text NOT NULL
);


--
-- Name: LorePlace; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LorePlace" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "placeId" text NOT NULL
);


--
-- Name: Organisation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Organisation" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "parentOrganisationId" text,
    "organisationType" public."OrganisationType",
    "isForDM" boolean DEFAULT false NOT NULL,
    flag text,
    membership public."Membership"
);


--
-- Name: OrganisationCity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrganisationCity" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "cityId" text NOT NULL
);


--
-- Name: OrganisationKingdom; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrganisationKingdom" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "kingdomId" text NOT NULL
);


--
-- Name: OrganisationMember; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrganisationMember" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "personId" text NOT NULL
);


--
-- Name: OrganisationPlace; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrganisationPlace" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "placeId" text NOT NULL
);


--
-- Name: PersonOfInterest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PersonOfInterest" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "imageUrl" text,
    "STR" integer NOT NULL,
    "DEX" integer NOT NULL,
    "CON" integer NOT NULL,
    "INT" integer NOT NULL,
    "WIS" integer NOT NULL,
    "CHA" integer NOT NULL,
    "kingdomId" text,
    "cityId" text,
    "placeId" text,
    breed public."Breed",
    sex public."Sex",
    membership public."Membership",
    languages public."Language"[],
    "districtId" text,
    "isForDM" boolean DEFAULT false NOT NULL,
    ca integer,
    pv integer,
    "showOnMap" boolean DEFAULT true NOT NULL,
    fp text
);


--
-- Name: Place; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Place" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "kingdomId" text,
    "cityId" text,
    "iconUrl" text,
    "districtId" text,
    "isForDM" boolean DEFAULT false NOT NULL,
    map text,
    "showOnMap" boolean DEFAULT true NOT NULL,
    "placeType" public."PlaceType" DEFAULT 'AUTRE'::public."PlaceType" NOT NULL
);


--
-- Name: PlayerCharacter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlayerCharacter" (
    id text NOT NULL,
    name text NOT NULL,
    class public."DnDClass",
    level integer DEFAULT 1 NOT NULL,
    race public."Breed",
    background text,
    alignment public."DnDAlignment",
    "imageUrl" text,
    description text,
    "STR" integer DEFAULT 10 NOT NULL,
    "DEX" integer DEFAULT 10 NOT NULL,
    "CON" integer DEFAULT 10 NOT NULL,
    "INT" integer DEFAULT 10 NOT NULL,
    "WIS" integer DEFAULT 10 NOT NULL,
    "CHA" integer DEFAULT 10 NOT NULL,
    pv integer,
    "pvMax" integer,
    ca integer,
    initiative integer,
    speed integer,
    "isForDM" boolean DEFAULT false NOT NULL,
    "showOnMap" boolean DEFAULT true NOT NULL,
    "kingdomId" text,
    "cityId" text,
    "districtId" text,
    "placeId" text
);


--
-- Name: PlayerCharacterEquipmentItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlayerCharacterEquipmentItem" (
    id text NOT NULL,
    "playerCharacterId" text NOT NULL,
    name text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    description text,
    equipped boolean DEFAULT false NOT NULL
);


--
-- Name: PlayerCharacterSavingThrow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlayerCharacterSavingThrow" (
    id text NOT NULL,
    "playerCharacterId" text NOT NULL,
    ability text NOT NULL,
    proficient boolean DEFAULT false NOT NULL
);


--
-- Name: PlayerCharacterSkill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlayerCharacterSkill" (
    id text NOT NULL,
    "playerCharacterId" text NOT NULL,
    name text NOT NULL,
    proficient boolean DEFAULT false NOT NULL,
    expertise boolean DEFAULT false NOT NULL,
    ability text DEFAULT 'DEX'::text NOT NULL
);


--
-- Name: PlayerCharacterSpell; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlayerCharacterSpell" (
    id text NOT NULL,
    "playerCharacterId" text NOT NULL,
    name text NOT NULL,
    level integer DEFAULT 0 NOT NULL,
    school text,
    description text,
    prepared boolean DEFAULT false NOT NULL
);


--
-- Name: Position; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Position" (
    id text NOT NULL,
    x double precision NOT NULL,
    y double precision NOT NULL,
    "kingdomId" text,
    "cityId" text,
    "placeId" text,
    "personOfInterestId" text,
    "playerCharacterId" text
);


--
-- Name: Quest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Quest" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    status public."QuestStatus" DEFAULT 'A_FAIRE'::public."QuestStatus" NOT NULL,
    notes text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "campaignId" text
);


--
-- Name: QuestStep; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."QuestStep" (
    id text NOT NULL,
    "questId" text NOT NULL,
    title text NOT NULL,
    description text,
    status public."QuestStepStatus" DEFAULT 'A_FAIRE'::public."QuestStepStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    optional boolean DEFAULT false NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    type public."UserType" NOT NULL
);


--
-- Name: _CampaignPlayers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_CampaignPlayers" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Campaign; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Campaign" (id, name, description, color, "order", "createdAt", "updatedAt") FROM stdin;
b53a0e0e-f892-40bc-add4-08714b7c88ce	Un oeuf pour les contrôler tous	\N	#c9962f	0	2026-08-13 16:03:54.935	2026-09-06 14:23:31.2
e30a0303-cbac-4684-956a-a19ff6d1e761	Une Nuit de trop	\N	#5b53a8	1	2026-08-13 16:03:54.931	2026-09-06 14:23:31.201
\.


--
-- Data for Name: City; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."City" (id, name, description, "kingdomId", "iconUrl", "isForDM", flag, map) FROM stdin;
c136e1cc-0f84-4729-b3e2-8dee3e6d46e1	Olcario	Olcario	\N	/Icon/fortified-city.png	f	\N	\N
b6d0fb34-df10-41f9-ab7a-585402919c03	Damor	Damor	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
ec01895d-64a4-4687-8f2d-035f149904ed	Dugh Maral	Dugh Maral	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/capital.png	f	\N	\N
4de27113-8487-455c-ab37-d740d69d5619	Nollodrin	Nollodrin	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
7f0198e3-b293-4d8c-a7ed-0bd1b9120e17	Port des Abymes	Port des Abymes	\N	/Icon/fortified-city.png	f	\N	\N
0ff4ed2b-4048-4ce9-9ec3-1c617727895c	Bakata	Bakata	\N	/Icon/fortified-city.png	f	\N	\N
bb93ab0c-8f81-430e-ac0b-16800b113e0e	Raine	Raine	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
7ccf7b24-0e5e-42e5-8493-76ee231c25ac	Gandor	Gandor	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/capital.png	f	\N	\N
157a72f3-cc46-4430-8e4f-9ab0fefcf133	Vesa	Vesa	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
b508926d-83a0-4372-92d7-2363aeade1f4	Flosse	Flosse	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
16e1a8a5-bbef-4927-b769-733a5cc63521	Brodnica	Brodnica	4d37eed1-161e-4156-970c-381793c3d614	/Icon/capital.png	f	\N	\N
443543db-314f-472e-a899-3d42f34fdb5f	Karni	Karni	4d37eed1-161e-4156-970c-381793c3d614	/Icon/fortified-city.png	f	\N	\N
e270ac1d-4df4-4af9-bb2c-ed96865d3b12	Velmira	capital elfe	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/capital.png	f	\N	\N
94a2fd1d-9a42-4b60-ba6e-865208b430c1	Kelrion	Kelrion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/fortified-city.png	f	\N	\N
2580fe9d-e8a1-46f1-83c1-d33b26ed6863	A'salion	A'salion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/capital.png	f	\N	\N
3777dab0-1e36-491c-859a-fdc48062201b	Örvat	Örvat	\N	/Icon/fortified-city.png	f	\N	\N
ce3fb962-bb73-47f4-8e12-656c0af3f4a1	Mongar	Mongar	\N	/Icon/fortified-city.png	f	\N	\N
a602cacc-0d51-4334-a9e9-b54a7d60ac24	Anol	Anol	\N	/Icon/fortified-city.png	f	\N	\N
47119f73-bd40-4a59-b1c4-b8daf1b0eade	Haneti	Haneti	\N	/Icon/fortified-city.png	f	\N	\N
6b642f1f-70b8-4b37-ba14-9e3922efe3a8	Kashari	Kashari	\N	/Icon/fortified-city.png	f	\N	\N
f410d0e6-ae0b-47b9-92d0-a91e1a0e65a0	Mahate	Mahate	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
ac1ff1a0-087e-4400-8ce6-91337e238d24	Sulayman	Sulayman	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/city.png	f	\N	\N
b35688a0-96ed-4416-82b9-19db566f7815	Sandarane	Sandarane	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/capital.png	f	\N	\N
d11ea82c-fc71-44f1-8d14-5ae423a31f83	Alkwariz-mi	Alkwariz-mi	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
cfda6692-0df6-400e-b9df-6786da0f1d92	Shur-Abak	Shur-Abak	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
42220881-20fd-4bc5-a818-d00cd79473b7	Al-Kurfrah	Al-Kurfrah	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
7c205d43-f91b-46f1-8809-7e774090823f	Raoued	Raoued	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
f9f210bd-a735-4acc-a72e-701aea69750b	Iserna	Iserna	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	Russolio	Russolio	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
8d5a0617-0e82-4a8a-855f-582c1003805f	Calteri	Calteri	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/capital.png	f	\N	\N
42044469-437c-43d5-b1e3-41c4c6b18035	Arrezo	Arrezo	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
d52e5905-28b3-427a-b3ed-82a0d5646a9c	Volturo	Volturo	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	Momoritania	Momoritania	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/capital.png	f	\N	\N
388f3dfc-a23b-4cb4-8a38-4f15e36cdca6	Gomati	Gomati	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
f4722f65-bb3e-400d-b818-260db1011f3a	Bag	Bag	\N	/Icon/fortified-city.png	f	\N	\N
752d5094-7102-4a38-926a-cb814de89e27	Åsel	Åsel	\N	/Icon/fortified-city.png	f	\N	\N
2c8c2982-7dfa-4be4-96e9-328c05473197	Vara	Vara	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
fce0576a-07d3-436d-a1be-2f7ea9ad34f2	Almiros	Almiros	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/city.png	f	\N	\N
7e2bddb2-6fc1-4d3e-8f50-95a6d241f012	Kelos	Kelos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
264a9f82-fdc3-4667-bd60-439a2a89ab04	Thiva	Thiva	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
57171985-dade-4fcc-a00b-c06de058c7d6	Huriya	Cité libre située entre un fleuve(artère azure) et une chaîne de montagne(les Monts Affamés), elle est enclavée entre le royaume de Gandorenne et le Saint-empire Momoritanien de compte ~22000 âmes(bat. 3532) ça renommé à était faite grâce à la frappe de monnaie pour les 2 empires contigu. Elle est aussi connue car elle contient le Palais des Ententes.\nArchitecturalement, la ville attire l’attention par ses murs formé par les épées des mort des empire et son arche en or. Ses rues sont assez étroites et sinueuses. Les bâtiments sont souvent des petites échoppes construites en pierre au rez-de-chaussée suivie d’un ou ou plusieur étage en bois avec pour les plus aisé des murs recouvert de chaux.\nLa sécurité de la ville est maintenue par une Cohorte de mercenaire appelé les écu d’or. Elle connue pour excellé dans l'entraînement de ces recrues.	\N	/Icon/city.png	f	/flag/Huriya.png	/map/Huriya.png
19e896ae-0b41-46ed-923f-825f43215b53	Doxato	Doxato	\N	/Icon/fortified-city.png	f	\N	\N
d182b816-ac9f-4f81-afb7-44c7bff6178f	Kalanos	Kalanos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
3c456778-4811-4c35-8504-6af9803f8c5e	Dioni	Dioni	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
3cd0ba8b-db9c-4cbe-83e9-49a515399cbb	Pharat	Phara	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/city.png	f	\N	\N
b220665e-2800-44ce-84e0-b0f9313640ed	Zametan	Zametan	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
fd428152-24ae-4cf5-8239-ad928df9f930	Raino	Raino	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
72589e8c-bbbe-43fe-bb68-c7be7fbe0347	Stiffe	Stiffe	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
4f2eca99-0e4a-4039-a211-9509758b8de3	Naxos	Naxos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
e2d54173-58fe-4417-b763-e90fca60fd31	Xanthi	Xanthi	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
6d39b2bc-6488-4763-9643-b57e9af59c03	Alagir	<h2><strong>Résumé rapide</strong></h2><ul><li><p><strong>Situation :</strong> Cité libre entre le fleuve <strong>Artère Azurée</strong> et les <strong>Monts Rouges</strong>, au sud du Royaume de Gandorènne et du Saint-Empire Momoritain.</p></li><li><p><strong>Surnoms :</strong> la Cité Pourpre, le Compte‑Fort, la Verrière du Sud.</p></li><li><p><strong>Population :</strong> Environ <strong>31 000 habitants</strong> (5 000 bâtiments).</p></li><li><p><strong>Renommée :</strong></p><ul><li><p>Ses <strong>carrières de marbre pourpre</strong>, uniques au monde.</p></li><li><p>Son <strong>réseau bancaire</strong> influent (Couronne de Platine, Caisse des Richesses Cachées).</p></li></ul></li><li><p><strong>Architecture :</strong> murailles veinées de pourpre, toits d’ardoise rouge, vitraux monumentaux, ruelles étroites.<br><strong>Gouvernement :</strong> Monarchie libre, dirigée par <strong>Roi Pelfort Vanguard</strong> et <strong>Reine Guetel</strong>.</p></li><li><p><strong>Factions majeures :</strong> Tovalis (commerce), Palhindile (diplomatie), Cilovard (banque), Syndicat, Soleil Pourpre.</p></li><li><p><strong>Foi dominante :</strong> Ral &amp; Tal Olena (paix, beauté, harmonie).</p></li><li><p><strong>Secret caché :</strong> Dans les profondeurs dort un <strong>temple oublié</strong> dont le nom du dieu a été martelé sur chaque pierre.</p></li><li><p><strong>Climat social :</strong> Prospérité mêlée de peur — la ville respire la richesse et le contrôle, mais murmure d’une présence invisible.&nbsp;</p></li></ul><p><em>« Là où l’or saigne et la pierre chante, les dieux détournent le regard. »</em></p><p>— Proverbe populaire d’Alagir</p>	\N	/Icon/city.png	f	\N	/maps/4d47919d-a7bf-42f4-a77d-7575f29ba20f.png
da0f5b30-743d-422a-b281-9d276681f56f	Vonbadur	Vonbadur	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
19df6e53-8868-4511-8a58-39c9e3659c21	Khairn Ladim	Kairn Ladim	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
bdb2dcea-441e-4a99-9f75-200d554d88f6	Khairn Baduhr	Khairn Baduhr	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
2859a2c9-8ccc-4de5-a74e-4b8be15bb838	Orfani	Orfani	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
899e1c2a-a99b-4eef-8e00-5657476b4a27	Amblon	Amblon	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
295580b8-9df6-4209-9d2a-1d237144a69c	Sillenor	Sillenor	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
96745fc0-6d7e-421c-a0a8-3bbb12b8f4c9	Jima	Jima	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
e46962cc-2d61-423b-b3b8-e7466ffcd976	Morag	Morag	4d37eed1-161e-4156-970c-381793c3d614	/Icon/fortified-city.png	f	\N	\N
ce4ce8b9-77fd-4105-a0fb-ee5edb557a7c	Orneta	Orneta	4d37eed1-161e-4156-970c-381793c3d614	/Icon/fortified-city.png	f	\N	\N
d5c6a0ac-1cb8-47cb-b0fc-aa17fefc587e	Asyn	Asyn	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/fortified-city.png	f	\N	\N
9c44080d-9577-4c58-9a2f-4b8111c491d2	Oserinne	Oserinne	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/fortified-city.png	f	\N	\N
181d1980-2ade-4c0d-bf44-4252e636dc6c	Irnael	Irnael	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/fortified-city.png	f	\N	\N
5d0cc51f-c6ac-4036-ad03-7344efecb965	Erilion	Erilion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/fortified-city.png	f	\N	\N
6c33f828-7b6b-4890-95ce-0822caa1e807	Phosi	Phosi	\N	/Icon/fortified-city.png	f	\N	\N
c1e27b23-4188-4fdd-96df-9d9dba88833b	Madja	Madja	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
1ab001f3-e7d0-4cb2-a0ff-c6800549dc8d	Aya-Toumin	Aya-Toumin	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
aef53759-d6b9-4bca-bc2b-7aca5ffb2676	Gizab	Gizab	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
3c5962f4-339b-433a-b253-135a32db63f1	Nyala	Nyala	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
f64aae8f-c25e-446d-b281-cc1c0fff707e	Beor Kharam (N.)	(clan nomade)\nCavaliers des Plaines Vivantes (~450 personnes)\n\nDans les vastes plaines et collines du sud-ouest de la Momoritanie vit un peuple semi-nomade connu sous le nom de Beor Khan. Les érudits impériaux les décrivent souvent comme des barbares des steppes, mais cette vision simpliste ignore la profondeur de leur culture et de leurs traditions.\n\nLes Beor Khan ne forment pas un royaume au sens classique du terme. Ils sont un peuple de clans unifiés par :\ndes serments anciens,\ndes rites spirituels,\net un profond respect des forces naturelles.\n\nLeur société repose sur un équilibre sacré entre :\nla force guerrière,\net la sagesse des esprits.\n\nAinsi, les Beor Khan sont gouvernés par un duumvirat tribal :\nun chef de guerre,\net un grand druide gardien des traditions.\n\nLes Beor Khan vivent dans :\n\nde grandes steppes herbeuses,\ndes collines balayées par les vents,\ndes vallées rocheuses,\net d’anciennes terres de failles oubliées.\n\nLeurs campements changent plusieurs fois par an selon :\n\nles saisons,\nles troupeaux,\nles vents,\net les signes des esprits.\n\nLeurs habitations sont composées :\n\nde tentes épaisses en cuir et laine,\nd’armatures d’os sculptés,\net de grands totems de bois gravés.\n\nLa nuit, leurs campements résonnent :\n\nde chants graves,\nde récits des anciens,\net du son profond des tambours rituels.\n\nRépartition\n~140 guerriers\n~90 cavaliers spécialisés\n~35 druides et chamans\n~25 artisans itinérants\nle reste : chasseurs, familles, anciens et enfants\n\nTechniques célèbres :\nCharge des Vents Gris\nUne charge de cavalerie soutenue par des rafales invoquées par les chamans.\n\nCercle des Racines Vivantes\nLes druides immobilisent les ennemis pendant que les guerriers les encerclent.\n\nRite de la Terre Fendue\nUn ancien rituel chamanique provoquant des fissures et secousses localisées.\n\n\nSpiritualité\n\nLes Beor Khan croient que :\n« Le monde respire sous nos pieds et chante dans le vent. »\n\nIls vénèrent principalement :\nRal Odius — le Souffle du Vent\nTal Odius — la Terre Immobile\nRal Alion — la Vie Sauvage\nTal Brahnera — la Paix avant la Guerre\n\nPour eux :\nles plaines sont vivantes,\nles vents portent les voix des ancêtres,\net les montagnes rêvent sous la pierre.\n\nRelations avec l’Empire Momoritain\n\nLes relations entre les Beor Khan et l’Empire restent tendues.\n\n\nLes Momoritains les considèrent comme :\ndes sauvages difficiles à contrôler,\nmais également comme d’excellents éclaireurs et cavaliers.\n\nPlusieurs généraux impériaux ont tenté de :\n\nles sédentariser,\nles diviser,\nou les écraser.\n\nAucun n’a réellement réussi.\n\nLe camp (repères pour le MJ)\n\nLe Cercle des Braises — feu central, cœur social de la tribu. Drogan y juge les étrangers ; les récits des ancêtres s'y content le soir.\n\nL'Enclos des Vents — parc à chevaux semi-sauvages. Dressage DC 13 pour s'attacher une monture.\n\nLa Tente des Cendres — tente funéraire où sont conservées les reliques des morts. Accès restreint ; c'est là qu'aurait dû reposer la cape de Vaskar Skoren si Zarak Solara ne l'avait pas volée (voir tertre des Ombre).\n\nL'Autel de Pierre-Levée — menhir sacré en périphérie du camp, où Sylvae mène ses rituels (Communion avec la Nature).\n\nInteractions possibles\n\nL'épreuve du Cercle — duel à mains nues non létal contre un guerrier, pour gagner un respect réel, pas juste la tolérance.\n\nLa lecture des vents — Sylvae offre une vision rituelle contre une confidence : un secret du visiteur contre une vision.\n\nDéfi équestre — course improvisée avec les enfants du camp, moyen léger de gagner en sympathie avant une discussion sérieuse avec Drogan.\n\nVendeurs du camp\n\nLe troc reste largement préféré à l'or. Voir les fiches individuelles pour l'inventaire détaillé et les prix.\n\nTarek l'Échangeur — fournitures de voyage et curiosités glanées sur les routes.\n\nVieille Yenna — peaux, fourrures, réparation d'objets en cuir/plume.\n\nOld Ashka — conteur aveugle, légendes de la tribu et babioles porte-bonheur.	\N	/Icon/fortified-city.png	f	\N	\N
\.


--
-- Data for Name: Combat; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Combat" (id, name, round, "activeTurnIndex", status, "createdAt", "updatedAt", "questStepId") FROM stdin;
\.


--
-- Data for Name: Combatant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Combatant" (id, "combatId", name, "playerCharacterId", "personId", "initiativeRoll", "currentHp", "maxHp", ca, conditions, "createdAt") FROM stdin;
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comment" (id, description, "dateInGame", "kingdomId", "cityId", "placeId", "personOfInterestId", "authorId", "districtId") FROM stdin;
\.


--
-- Data for Name: District; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."District" (id, name, motto, content, ambiance, rumors, secret, "cityId") FROM stdin;
7402f449-7ae2-461d-9981-e45c942f169f	la place sombre	\N	le quartier historique qui à fait la renommée de la ville avec ces immenses fonderies	\N	\N	\N	57171985-dade-4fcc-a00b-c06de058c7d6
a118cdca-1dd1-448f-9729-b688fe5b87ef	les bas-quartiers	\N	\N	où se massent les classes moyennes et une partie des commerces.	\N	\N	57171985-dade-4fcc-a00b-c06de058c7d6
bc60c257-2aca-43c1-b4eb-32c92ad9b422	Le château	\N	où réside la garnison, les diplomates qui viennent siéger au Palais des Ententes qui leur est dédié, la famille Ivelis.	\N	\N	\N	57171985-dade-4fcc-a00b-c06de058c7d6
0a070760-36fd-43de-9b3f-5be9b9c52c41	Les Hauts Jardins	\N	Abrite les nantis de la ville. Entrée gardée.	\N	\N	\N	57171985-dade-4fcc-a00b-c06de058c7d6
118b0713-e8c3-4dec-ad03-ba76cfe63900	Le Port	\N	L’un des plus grand point d'échange entre les 2 Royaumes (un endroit lourdement garder)	\N	\N	\N	57171985-dade-4fcc-a00b-c06de058c7d6
1698f8f1-2c6a-468a-a602-125f47e6bdb4	La Porte Sud	\N	Bidonville à l'extérieur de ces épais murs le quartier de la port sud est peuplé de beaucoups de réfugiés.	\N	\N	\N	57171985-dade-4fcc-a00b-c06de058c7d6
60772e14-0028-4c5e-9411-f8ddf8a6c03b	La Porte au Brouillard	\N	Quartier populaire qui doit son nom à la brume matinal qui envahit la zone les matin.	\N	\N	\N	57171985-dade-4fcc-a00b-c06de058c7d6
e7bec6e6-fb32-44eb-99ff-1a5bfe748084	La Porte Pourpre	« Ici, la pierre vaut moins que la promesse. »	Cilovard dominent. Couronne de Platine pulse la nuit avec le cœur du Roi.	Quartier des banques : pavés de marbre rose, enseignes dorées. Balance géante de platine au sol.	Pièces de platine qui vibrent ou changent de teinte.	Comptoir de Résonance sous la Couronne : amplificateur psionique du Tyrannœil.	6d39b2bc-6488-4763-9643-b57e9af59c03
99a96ae0-ce96-4898-9015-4b7cfddb44b0	La Cinquième Roue	« Là où la pierre s'arrête, les routes commencent. »	Conseil d'Acier : caches sous hangars. Hangar du Poids, carrières.	Entrepôts, ateliers, brouillard rougeâtre permanent. Domaine Tovalis et Convoyeurs du Pourpre.	Chariot royal disparu avant inspection, coffre d'armes « vivantes ».	Faux mur vers le Bastion Gris (Conseil d'Acier).	6d39b2bc-6488-4763-9643-b57e9af59c03
7df130bd-3682-4c93-9412-a31f75d84ca8	Le Quartier des Tentations	« Les murs enferment la vertu, les portes de l'est la libèrent. »	Syndicat contrôle chaque établissement. Mages Palehindile en couverture artistique.	Plaisirs, théâtres, cabarets magiques, tripots. Lumières colorées contre les murailles.	Théâtre Le Miroir des Masques : clients sortent vidés de volonté.	Salle invisible du Miroir des Masques : expériences psioniques de l'Œil Pourpre.	6d39b2bc-6488-4763-9643-b57e9af59c03
de27c25a-119c-4435-a163-59bdc7240279	Les Jardins des Âmes	« Les âmes poussent à même la pierre. »	Factions : Tovalis (contremaîtres), Syndicat (Faith), Soleil Pourpre patrouille rarement. Lieux : Marché des Mille Voix, Cour des Murs Rouges, Auberge du Murmure.	Labyrinthe de ruelles étroites, maisons superposées, lanternes suspendues. Cœur populaire : artisans, dockers, Syndicat. Poussière de marbre rosée au couchant.	Voix dans les conduits d'eau (« âmes du jardin »). Agents du Roi disparus ; armures fondues dans un puits.	Sous la Cour des Murs Rouges : puits vers les catacombes du Temple Scellé ; souffle de poussière noire (souvenirs minéraux).	6d39b2bc-6488-4763-9643-b57e9af59c03
cd218e67-1630-4948-a3e2-585a884aee96	Le Chant de Tal Taris	« Là où l'eau touche la pierre, les dieux marchandent leurs reflets. »	Syndicat règne ; Cilovard sur les quais modernes. Conseil d'Acier discret. Soleil Pourpre prélève un tribut.	Quartier des docks sur l'Artère Azurée. Entrepôts, tavernes, quais bondés. Sel, fumée, torches sur le fleuve la nuit.	Navire fantôme La Griffe du Roi. Faith et une entité aquatique sous la pleine lune.	Chambre noyée sous les Docks des Lunes : sanctuaire de Tal Taris relié au Temple Scellé.	6d39b2bc-6488-4763-9643-b57e9af59c03
a3bd30af-d091-4c93-846e-14e869ce69e5	Le Château de Verre (quartier)	« Le trône est une lentille. Il ne crée pas la lumière, il la déforme. »	Maison Vanguard, Soleil Pourpre, Œil Pourpre (secret). Audience, bals, vol de vitrail.	Palais aux vitraux cyclopéens, reflets sur la ville. Escaliers trompeurs, miroirs vibrants.	L'air semble vous regarder dans certains couloirs.	Salle des Trois Cercles : reflets tracent la carte mentale d'Alagir pour le Roi. Caves : le Temple Scellé, et les percements de la Crypte Rubis.	6d39b2bc-6488-4763-9643-b57e9af59c03
78422bae-0fb6-4f20-935f-7c0536f9fcef	Les Comptes de Zitris	« Là où la chance danse, la prudence compte. »	Cilovard, Palehindile (Maison des Listes), Syndicat infiltré, Conseil d'Acier observe le fer.	Change quotidien : pavés propres, auvents pourpre, carillon de clochettes à chaque transaction.	Faillites orchestrées. Société fantôme La Balance Rouge. Prêtre entend les chiffres.	Salle circulaire sous C.C.R.C. : autel de Zitris — nœud de chance et de ruine, alimente le réseau du Roi.	6d39b2bc-6488-4763-9643-b57e9af59c03
\.


--
-- Data for Name: FamilyMember; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FamilyMember" (id, "organisationId", name, title, "personId", "playerCharacterId", "fatherId", "motherId", "spouseId", sex, "isFounder", generation, "order", notes, "isForDM", "createdAt", "superiorId") FROM stdin;
d98b99b1-47cb-4c17-8cd5-61ba408db107	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Valdris	Dragon d'or	\N	\N	\N	\N	ac0d04f7-ee1c-4eea-b3fb-089752cfab62	MAN	t	0	0	\N	f	2026-09-04 10:49:15.295	\N
4c0c972a-2052-4c5f-961e-b2527cb80fd4	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Ysolde	Arr.-gd-mère	\N	\N	\N	\N	d27f8c1d-df70-4df4-8d1e-dc22d9aaaa1b	WOMAN	f	3	1	\N	f	2026-09-04 10:49:15.305	\N
0d8aeacf-559b-490e-b2db-2696bf768182	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Aemrys	Ancêtre (~300 ans)	\N	\N	d98b99b1-47cb-4c17-8cd5-61ba408db107	ac0d04f7-ee1c-4eea-b3fb-089752cfab62	\N	MAN	f	1	0	\N	f	2026-09-04 10:49:15.301	\N
4e8a5c06-c85d-42d4-8cbe-eaaad564a4f6	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Fenwick	Aïeul	\N	\N	0d8aeacf-559b-490e-b2db-2696bf768182	\N	9de30efa-d1dd-4ee2-b69c-172151fb510b	MAN	f	2	0	\N	f	2026-09-04 10:49:15.302	\N
872ea013-9abe-48e6-a4a2-45b8844610a2	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Nyneth	Grand-mère	\N	\N	\N	\N	7b0d1530-fd7c-469d-a610-8c50b5fff331	WOMAN	f	4	1	\N	f	2026-09-04 10:49:15.307	\N
d27f8c1d-df70-4df4-8d1e-dc22d9aaaa1b	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Aerendil	Arr.-gd-père	\N	\N	4e8a5c06-c85d-42d4-8cbe-eaaad564a4f6	9de30efa-d1dd-4ee2-b69c-172151fb510b	4c0c972a-2052-4c5f-961e-b2527cb80fd4	MAN	f	3	0	\N	f	2026-09-04 10:49:15.304	\N
45aa5e85-f2a6-437f-b4b0-6080af449f95	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Elyndra	Grand-mère	\N	\N	\N	\N	1e27f762-7781-4b01-8d4d-640579b445a4	WOMAN	f	4	3	\N	f	2026-09-04 10:49:15.309	\N
7b0d1530-fd7c-469d-a610-8c50b5fff331	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Thalindor	Grand-père	\N	\N	d27f8c1d-df70-4df4-8d1e-dc22d9aaaa1b	4c0c972a-2052-4c5f-961e-b2527cb80fd4	872ea013-9abe-48e6-a4a2-45b8844610a2	MAN	f	4	0	\N	f	2026-09-04 10:49:15.306	\N
0fbb5a55-734b-4f85-968b-430997cffa5a	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Alenya	Épouse	\N	\N	\N	\N	30f9fbb5-9330-4645-9de3-bb3060ce3b2a	WOMAN	f	5	1	\N	f	2026-09-04 10:49:15.311	\N
1e27f762-7781-4b01-8d4d-640579b445a4	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Vaelorin	Grand-père	\N	\N	\N	\N	45aa5e85-f2a6-437f-b4b0-6080af449f95	MAN	f	4	2	\N	f	2026-09-04 10:49:15.308	\N
2bae1331-8ecd-4593-82f0-1db3ce6d2693	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Garrick	Époux	\N	\N	\N	\N	67ead6ac-e386-4687-ad18-0eb85b18d65b	MAN	f	5	3	\N	f	2026-09-04 10:49:15.313	\N
30f9fbb5-9330-4645-9de3-bb3060ce3b2a	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Corwin	Oncle	\N	\N	7b0d1530-fd7c-469d-a610-8c50b5fff331	872ea013-9abe-48e6-a4a2-45b8844610a2	0fbb5a55-734b-4f85-968b-430997cffa5a	MAN	f	5	0	\N	f	2026-09-04 10:49:15.31	\N
0a5fa153-ceee-488d-a102-b71de4a04097	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Faelynn	Mère	\N	\N	1e27f762-7781-4b01-8d4d-640579b445a4	45aa5e85-f2a6-437f-b4b0-6080af449f95	0e864de7-f610-4ead-860e-4a0bc3dece30	WOMAN	f	5	5	\N	f	2026-09-04 10:49:15.315	\N
67ead6ac-e386-4687-ad18-0eb85b18d65b	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Elowen	Tante	\N	\N	7b0d1530-fd7c-469d-a610-8c50b5fff331	872ea013-9abe-48e6-a4a2-45b8844610a2	2bae1331-8ecd-4593-82f0-1db3ce6d2693	WOMAN	f	5	2	\N	f	2026-09-04 10:49:15.312	\N
c0404a5e-e539-416b-b1a3-5ba5b8fb8e7f	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Baelric	Époux	\N	\N	\N	\N	2879debd-2805-4526-a4cd-b532a9c1da54	MAN	f	5	7	\N	f	2026-09-04 10:49:15.317	\N
0e864de7-f610-4ead-860e-4a0bc3dece30	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Ithendor	Père	\N	\N	7b0d1530-fd7c-469d-a610-8c50b5fff331	872ea013-9abe-48e6-a4a2-45b8844610a2	0a5fa153-ceee-488d-a102-b71de4a04097	MAN	f	5	4	\N	f	2026-09-04 10:49:15.314	\N
6b06675a-7a5d-423c-bcec-a2d811c4bf44	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Saelwen	Épouse	\N	\N	\N	\N	f27e14d5-921a-4ac4-9bc1-c582d83c2026	WOMAN	f	5	9	\N	f	2026-09-04 10:49:15.319	\N
2879debd-2805-4526-a4cd-b532a9c1da54	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Miriel	Tante	\N	\N	1e27f762-7781-4b01-8d4d-640579b445a4	45aa5e85-f2a6-437f-b4b0-6080af449f95	c0404a5e-e539-416b-b1a3-5ba5b8fb8e7f	WOMAN	f	5	6	\N	f	2026-09-04 10:49:15.316	\N
6da989c7-46f1-4e5a-9c8d-ce5aa5d408ce	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Joren	Époux	\N	\N	\N	\N	9d869902-9041-47a5-a030-e9fe327ae767	MAN	f	6	1	\N	f	2026-09-04 10:49:15.321	\N
f27e14d5-921a-4ac4-9bc1-c582d83c2026	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Aldric	Oncle	\N	\N	1e27f762-7781-4b01-8d4d-640579b445a4	45aa5e85-f2a6-437f-b4b0-6080af449f95	6b06675a-7a5d-423c-bcec-a2d811c4bf44	MAN	f	5	8	\N	f	2026-09-04 10:49:15.318	\N
9d869902-9041-47a5-a030-e9fe327ae767	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Vaelyra	Cousine	\N	\N	30f9fbb5-9330-4645-9de3-bb3060ce3b2a	0fbb5a55-734b-4f85-968b-430997cffa5a	6da989c7-46f1-4e5a-9c8d-ce5aa5d408ce	WOMAN	f	6	0	\N	f	2026-09-04 10:49:15.32	\N
d8e4ae98-52c2-4a83-9748-bea06fd56daa	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Aerin	Cousin	\N	\N	30f9fbb5-9330-4645-9de3-bb3060ce3b2a	0fbb5a55-734b-4f85-968b-430997cffa5a	\N	MAN	f	6	2	\N	f	2026-09-04 10:49:15.322	\N
177408ce-b59a-4f11-9363-eaea8ac226d1	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Nimwen	Cousine	\N	\N	2bae1331-8ecd-4593-82f0-1db3ce6d2693	67ead6ac-e386-4687-ad18-0eb85b18d65b	\N	WOMAN	f	6	3	\N	f	2026-09-04 10:49:15.323	\N
dd8e8272-c93b-4b7a-ae86-80a40a250b55	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Sylwen	Sœur aînée	\N	\N	0e864de7-f610-4ead-860e-4a0bc3dece30	0a5fa153-ceee-488d-a102-b71de4a04097	\N	WOMAN	f	6	4	\N	f	2026-09-04 10:49:15.324	\N
781b423d-a77c-468b-8edc-46d572b1e105	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Ithaniel	Frère	\N	\N	0e864de7-f610-4ead-860e-4a0bc3dece30	0a5fa153-ceee-488d-a102-b71de4a04097	\N	MAN	f	6	5	\N	f	2026-09-04 10:49:15.326	\N
5b378029-e44e-4345-8dcf-d448a711219c	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Elerÿna	★ Notre PJ	\N	67647120-404a-4ad4-84a8-716bda739c6d	0e864de7-f610-4ead-860e-4a0bc3dece30	0a5fa153-ceee-488d-a102-b71de4a04097	\N	WOMAN	f	6	6	\N	f	2026-09-04 10:49:15.327	\N
6382f713-265e-4c1b-81c2-00b931570945	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Rowan	Cousin	\N	\N	c0404a5e-e539-416b-b1a3-5ba5b8fb8e7f	2879debd-2805-4526-a4cd-b532a9c1da54	\N	MAN	f	6	7	\N	f	2026-09-04 10:49:15.328	\N
04e9379f-d007-48e3-8827-5f44caabaf85	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Aelwyn	Cousine	\N	\N	c0404a5e-e539-416b-b1a3-5ba5b8fb8e7f	2879debd-2805-4526-a4cd-b532a9c1da54	\N	WOMAN	f	6	8	\N	f	2026-09-04 10:49:15.329	\N
f3e3dd78-9541-4866-92d1-65778b4773fd	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Faeldrin	Cousin	\N	\N	f27e14d5-921a-4ac4-9bc1-c582d83c2026	6b06675a-7a5d-423c-bcec-a2d811c4bf44	\N	MAN	f	6	9	\N	f	2026-09-04 10:49:15.33	\N
f024b20b-34e3-449e-b9ee-3d48eb14d502	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Ysendra	Petite-cousine	\N	\N	6da989c7-46f1-4e5a-9c8d-ce5aa5d408ce	9d869902-9041-47a5-a030-e9fe327ae767	\N	WOMAN	f	7	0	\N	f	2026-09-04 10:49:15.331	\N
ac0d04f7-ee1c-4eea-b3fb-089752cfab62	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Miralyn	Fondatrice	\N	\N	\N	\N	d98b99b1-47cb-4c17-8cd5-61ba408db107	WOMAN	t	0	1	\N	f	2026-09-04 10:49:15.299	\N
9de30efa-d1dd-4ee2-b69c-172151fb510b	b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Lyara	Aïeule	\N	\N	\N	\N	4e8a5c06-c85d-42d4-8cbe-eaaad564a4f6	WOMAN	f	2	1	\N	f	2026-09-04 10:49:15.303	\N
3a281420-6861-4bf1-aa5a-076c59262d54	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	Lady Velena Cilovard	Épouse de Garran	f77d9ba9-30c8-4d94-b0c1-89420f643296	\N	\N	\N	da572fde-e8ae-4cd4-828c-c7c4775da1a2	WOMAN	f	0	1	\N	f	2026-09-04 11:09:11.92	\N
da572fde-e8ae-4cd4-828c-c7c4775da1a2	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	Garran Cilovard	Patriarche	67a5fa35-103d-4486-831e-078d56beedc9	\N	\N	\N	3a281420-6861-4bf1-aa5a-076c59262d54	MAN	f	0	0	\N	f	2026-09-04 11:09:11.915	\N
5fa847c8-95be-4227-8cd8-b72ca2c94c6e	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	Lorian Cilovard	Fils aîné	e945a71d-9224-4272-8f9a-c6a775c22110	\N	da572fde-e8ae-4cd4-828c-c7c4775da1a2	3a281420-6861-4bf1-aa5a-076c59262d54	\N	MAN	f	1	0	\N	f	2026-09-04 11:09:11.921	\N
c3032587-e5d0-41c9-b027-d9d2902c7add	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	Ismara Cilovard	Fille cadette	5e356a69-f3d4-4d03-8046-3f7f89c3512f	\N	da572fde-e8ae-4cd4-828c-c7c4775da1a2	3a281420-6861-4bf1-aa5a-076c59262d54	\N	WOMAN	f	1	1	\N	f	2026-09-04 11:09:11.923	\N
4a31c354-7baf-477b-aa50-a0d4bf26eaf5	e6a42128-6fb4-4dea-bd11-2e34be47c513	Daren Tovalis	Patriarche	bcbef7a5-9109-44f2-a960-351ae35476db	\N	\N	\N	\N	MAN	f	0	0	\N	f	2026-09-04 11:09:11.933	\N
dd0a6170-7bb3-4246-8d28-4671bf3e0e11	e6a42128-6fb4-4dea-bd11-2e34be47c513	Ordan Tovalis	Porte-parole	148f0452-aa0f-42b1-83a4-23cb30cd0e18	\N	\N	\N	\N	MAN	f	0	1	\N	f	2026-09-04 11:09:11.934	\N
64a1a240-efac-4ee6-9f03-ee6a32815554	e6a42128-6fb4-4dea-bd11-2e34be47c513	Maerin Tovalis	Héritière	b9a0b7ee-5455-466d-86c0-12363226b383	\N	4a31c354-7baf-477b-aa50-a0d4bf26eaf5	\N	\N	WOMAN	f	1	0	\N	f	2026-09-04 11:09:11.935	\N
ae48ad7d-e062-416c-b876-ea108c63d12c	e6a42128-6fb4-4dea-bd11-2e34be47c513	Velric Tovalis	Fils cadet	d21e951b-fd8b-4c35-9e35-b3cddbbacd47	\N	4a31c354-7baf-477b-aa50-a0d4bf26eaf5	\N	\N	MAN	f	1	1	\N	f	2026-09-04 11:09:11.937	\N
a9eb8612-8c27-48a1-8670-ee5c30dcf9d4	c4566c9c-7412-4548-ae0b-e65351943294	Lady Serenya Palhindile	Matriarche · Chancelière	87d809bb-833e-4fa4-8dff-17e9cd7f3af3	\N	\N	\N	2f162105-5a0f-4eb3-b706-a35ec5edc23b	WOMAN	f	0	0	\N	f	2026-09-04 11:09:11.941	\N
738496d8-9690-45d8-9594-c78901e28ece	c4566c9c-7412-4548-ae0b-e65351943294	Selianne Palhindile	Héritière	41fa949e-a4a0-41b8-8c47-a3a6c080879f	\N	2f162105-5a0f-4eb3-b706-a35ec5edc23b	a9eb8612-8c27-48a1-8670-ee5c30dcf9d4	\N	WOMAN	f	1	0	\N	f	2026-09-04 11:09:11.943	\N
7a39b643-b660-4883-a260-aa84613f6056	c4566c9c-7412-4548-ae0b-e65351943294	Lior Palhindile	Mage archiviste	381eb3b5-c442-4fce-9388-e6df91d76f56	\N	2f162105-5a0f-4eb3-b706-a35ec5edc23b	a9eb8612-8c27-48a1-8670-ee5c30dcf9d4	\N	MAN	f	1	1	\N	f	2026-09-04 11:09:11.944	\N
2f162105-5a0f-4eb3-b706-a35ec5edc23b	c4566c9c-7412-4548-ae0b-e65351943294	Lord Calen Palhindile	Époux de Serenya	0622d84c-e5c2-4c64-bac5-74479683daee	\N	\N	\N	a9eb8612-8c27-48a1-8670-ee5c30dcf9d4	MAN	f	0	1	\N	f	2026-09-04 11:09:11.942	\N
88aa8207-f89f-4057-a666-73273204117e	ed402865-97fe-4623-a6b0-48d311d5f054	Pelfort Vanguard	Roi d’Alagir	60ee9017-2f5a-45c6-90ae-e7f253db2093	\N	\N	\N	4200e53c-65b4-487e-8973-d5a4989dd9ee	MAN	f	0	0	\N	f	2026-09-04 11:09:11.95	\N
d3ec1848-3c5f-4768-9862-71fc0c6b8ecc	ed402865-97fe-4623-a6b0-48d311d5f054	Priel Vanguard	Héritier (nourrisson)	54f82a8e-b086-4414-bd1f-489455a0ad8f	\N	88aa8207-f89f-4057-a666-73273204117e	4200e53c-65b4-487e-8973-d5a4989dd9ee	\N	MAN	f	1	0	\N	f	2026-09-04 11:09:11.952	\N
4200e53c-65b4-487e-8973-d5a4989dd9ee	ed402865-97fe-4623-a6b0-48d311d5f054	Guetel Vanguard	Reine	dc878db9-301f-4fbc-b3bb-63298432df54	\N	\N	\N	88aa8207-f89f-4057-a666-73273204117e	WOMAN	f	0	1	\N	f	2026-09-04 11:09:11.951	\N
91e0c0fb-38b3-41d6-a06a-aa839226eeff	72020f98-e744-4fa4-8a60-6ea12e81bb85	Aimon Ivelis	Chef de famille	0635e083-b406-40d7-993a-a29761a51e98	\N	\N	\N	d75b0279-a2a3-4b62-97e9-fb09834ee7e3	MAN	f	0	0	\N	f	2026-09-04 11:09:11.963	\N
40ba7a5b-c51c-4ad6-9763-4283d5911527	72020f98-e744-4fa4-8a60-6ea12e81bb85	Volodar Ivelis	Membre de la famille	fa898d26-72c6-4fa4-958d-5769659f0c96	\N	\N	\N	\N	MAN	f	0	2	\N	f	2026-09-04 11:09:11.973	\N
6ab69832-367f-4dba-9dcd-fbc8ec70cda8	72020f98-e744-4fa4-8a60-6ea12e81bb85	Akkar Ivelis	Fils	daf4f14e-23a8-43a4-a8d5-6b8b15f4f5e3	\N	91e0c0fb-38b3-41d6-a06a-aa839226eeff	d75b0279-a2a3-4b62-97e9-fb09834ee7e3	\N	MAN	f	1	0	\N	f	2026-09-04 11:09:11.976	\N
1edc6d5a-293b-4074-b683-3eb001cad544	72020f98-e744-4fa4-8a60-6ea12e81bb85	Ilrune Ivelis	Fils	3404bc03-fafd-4973-a52a-7abe5cc45f7b	\N	91e0c0fb-38b3-41d6-a06a-aa839226eeff	d75b0279-a2a3-4b62-97e9-fb09834ee7e3	\N	MAN	f	1	1	\N	f	2026-09-04 11:09:11.978	\N
3326caa1-034b-43d4-8d89-9e5f5ee84b8f	72020f98-e744-4fa4-8a60-6ea12e81bb85	Keerla Ivelis	Fille	88e30e84-b07b-4b8f-97fe-42f1ab21bd65	\N	91e0c0fb-38b3-41d6-a06a-aa839226eeff	d75b0279-a2a3-4b62-97e9-fb09834ee7e3	\N	WOMAN	f	1	2	\N	f	2026-09-04 11:09:11.981	\N
d75b0279-a2a3-4b62-97e9-fb09834ee7e3	72020f98-e744-4fa4-8a60-6ea12e81bb85	Sana Ivelis	Épouse d’Aimon · co-dirige Huriya	8c168c38-e7b9-41c2-8c19-31ab1291a61b	\N	\N	\N	91e0c0fb-38b3-41d6-a06a-aa839226eeff	WOMAN	f	0	1	\N	f	2026-09-04 11:09:11.971	\N
7fb3d462-e730-4d92-86c3-d7c8891df07e	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	Odran Varek	Patriarche · chef de Valbrume	52ab9bce-74dd-49b3-85c1-d519c83340f3	\N	\N	\N	53215549-8515-4919-854f-de8289bb60c9	MAN	f	0	0	\N	f	2026-09-04 11:09:12.003	\N
d3e963e7-3a12-41a1-88b4-15c0fdd55a41	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	Garrik Varek	Fils aîné	6951831e-2bb4-40e2-9ecc-bc3cacde1eb4	\N	7fb3d462-e730-4d92-86c3-d7c8891df07e	53215549-8515-4919-854f-de8289bb60c9	\N	MAN	f	1	0	\N	f	2026-09-04 11:09:12.007	\N
1dc6df71-9ec9-4b19-b26c-531062bb6792	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	Elira Varek	Fille cadette	636aae36-ee4c-4d40-aa22-95409a1f732d	\N	7fb3d462-e730-4d92-86c3-d7c8891df07e	53215549-8515-4919-854f-de8289bb60c9	\N	WOMAN	f	1	1	\N	f	2026-09-04 11:09:12.009	\N
53215549-8515-4919-854f-de8289bb60c9	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	Maela Varek	Épouse d’Odran	8e568e50-446f-4ccf-ad74-ba8fade07a59	\N	\N	\N	7fb3d462-e730-4d92-86c3-d7c8891df07e	WOMAN	f	0	1	\N	f	2026-09-04 11:09:12.005	\N
fdb1c8f3-08c2-4b06-bca2-c4272141d600	17ddb3d6-ad88-49dd-9760-c0aa8583d177	Dorian Rigart	Fondateur des entrepôts	32f901e7-8a07-44df-8854-b00536c41603	\N	\N	\N	\N	MAN	f	0	0	\N	f	2026-09-04 11:09:12.015	\N
59418739-87dc-4d3b-bacf-7e66478e8dd2	17ddb3d6-ad88-49dd-9760-c0aa8583d177	Eldric Rigart	Héritier	c885e82c-e64e-48e8-8136-5f76d4d4611b	\N	fdb1c8f3-08c2-4b06-bca2-c4272141d600	\N	\N	MAN	f	1	0	\N	f	2026-09-04 11:09:12.016	\N
c1cd5b41-2d01-47a2-845d-151793ef63f2	748c2d82-b991-4526-ba99-1613c0613c4a	Aedran Elvaltis	Gouverneur de Kalanos	662ac8f6-d0cc-41d6-a6fd-90458c351786	\N	\N	\N	\N	MAN	f	0	0	\N	f	2026-09-04 11:09:12.019	\N
a5018a85-7a34-4aa2-8a5f-01fb9ed21719	748c2d82-b991-4526-ba99-1613c0613c4a	Nyssara Elvaltis	Affaires sociales et religieuses	5caf0606-7c80-4c4b-8560-5dd138500a7d	\N	\N	\N	\N	WOMAN	f	0	1	\N	f	2026-09-04 11:09:12.02	\N
55e25fe8-b825-40a3-add0-4a2e356b989f	748c2d82-b991-4526-ba99-1613c0613c4a	Maeltor Elvaltis	Fils aîné	3f56a62c-1102-4826-8c27-bc212a07db29	\N	c1cd5b41-2d01-47a2-845d-151793ef63f2	\N	\N	MAN	f	1	0	\N	f	2026-09-04 11:09:12.021	\N
26f0e9c5-03a0-46af-8ea5-02cde67bc428	748c2d82-b991-4526-ba99-1613c0613c4a	Lyris Elvaltis	Fille cadette	fd742210-154f-416b-ac2c-a158d6a35b23	\N	c1cd5b41-2d01-47a2-845d-151793ef63f2	\N	\N	WOMAN	f	1	1	\N	f	2026-09-04 11:09:12.022	\N
ea00a989-9866-4e0c-9ffe-98ca5a05a11c	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	Gesouto Mastiggia	Ligne « Chaînes du Sang »	fa0063c9-958b-461c-b5ee-42fb880375bc	\N	\N	\N	\N	MAN	f	0	1	\N	f	2026-09-04 11:09:12.027	\N
fa6f89d9-d3f0-4904-a18b-441619cb42d8	1ac789f7-01b6-4c67-a1c2-843215557e9e	Ivano Tomasio	Comte	70ec3e88-19f2-4b45-9f1a-a6cf0e424b82	\N	\N	\N	\N	\N	f	0	0	\N	f	2026-09-04 11:09:12.032	\N
79568c29-a615-400f-9e21-55885290fea0	1ac789f7-01b6-4c67-a1c2-843215557e9e	Ennio Tomasio	Nourrisson	604c2fbb-7b71-4ec7-bcbc-42e12e1739fe	\N	\N	\N	\N	\N	f	1	0	\N	f	2026-09-04 11:09:12.036	\N
06e08063-12cd-4209-b2ab-005cf57befd6	72020f98-e744-4fa4-8a60-6ea12e81bb85	Galya Ivelis	Fille	b4ed8705-c606-4d5c-b2b2-20a02d7f68dd	\N	40ba7a5b-c51c-4ad6-9763-4283d5911527	\N	\N	WOMAN	f	1	3	\N	f	2026-09-04 11:09:11.984	\N
0976448b-0fc9-477d-85ba-2067237c84c8	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	Donna Ilaria Mastiggia	Matriarche du comptoir	56b8619e-f374-44f2-9c1f-38066674cde1	\N	\N	\N	ea00a989-9866-4e0c-9ffe-98ca5a05a11c	WOMAN	f	0	0	\N	f	2026-09-04 11:09:12.026	\N
62e9e966-3fdb-408c-bbe4-0cbb1d27e05f	b4c8c6a8-d147-4f42-b12b-74adc397469f	Wilherm Cadenet	Teneur du Grand Registre	c9abd4d1-579f-4006-98d4-f49494a1c1b0	\N	\N	\N	\N	\N	f	\N	2	\N	f	2026-09-06 15:00:59.309	ed9b4b2b-711e-4c23-874c-8623c1dabe4a
a1a9172e-d54e-4cdd-8541-0f92f7970d76	d9c8c611-2986-4e8c-856f-465fecbcdf16	Sir Gadwain Brise-fer	Capitaine de la Garde	558617f8-a75f-41f8-b9d9-0720d71e7754	\N	\N	\N	\N	\N	f	\N	2	\N	f	2026-09-06 15:00:59.326	5d0bdf3b-89bb-4cd4-ab34-70b38242f740
543c140a-6d9f-43d7-beab-38d9d73b7a04	62739da4-e5ed-46ef-8345-d0182f80bad3	Lys Corven	Sergent — Maîtresse des Éclaireurs	be422053-19d2-4236-bda9-702c8d9432ee	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.34	ab6276d4-33cc-4eaa-8589-55f127fe48cd
25d12118-b53a-4a3a-945f-df0e80f01d1d	d962acbe-1168-41f7-822a-806ee9b0729a	Jillian Riverpipe	Courtière	7633faa3-0a05-46c2-84ef-2af359ecddbd	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.287	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
7841c301-7964-438e-8431-c7b6b358ad4f	d962acbe-1168-41f7-822a-806ee9b0729a	Capitaine Norven	Capitaine de navire	0b636012-fa99-47bc-9147-8b8db7a4f6e9	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.289	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
95478532-29b6-4e9f-90ac-158a287fd347	d962acbe-1168-41f7-822a-806ee9b0729a	Marja la Cicatrice	Maîtresse d'arène	2ac16f69-2071-4585-ba34-c47f54e856d9	\N	\N	\N	\N	\N	f	\N	4	\N	f	2026-09-06 15:00:59.29	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
38a591e4-7feb-45e5-bfa0-dd122a969636	d962acbe-1168-41f7-822a-806ee9b0729a	Sarlis Nym	Cambiste nocturne	08c849e8-8e2c-47e0-a26d-764c484d897d	\N	\N	\N	\N	\N	f	\N	5	\N	f	2026-09-06 15:00:59.291	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
0ead9e03-7729-456c-a617-ab82ed95c06c	d962acbe-1168-41f7-822a-806ee9b0729a	Maître Verel	Croupier masqué	4b898112-8241-4622-986f-b38d364315ae	\N	\N	\N	\N	\N	f	\N	6	\N	f	2026-09-06 15:00:59.292	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
1c2bb8ee-2666-40c9-994c-cf67a9833a47	d962acbe-1168-41f7-822a-806ee9b0729a	Mada Lure	Gardienne de la clé	6a5b7b66-69da-4d52-ae5c-429c06c4e922	\N	\N	\N	\N	\N	f	\N	7	\N	f	2026-09-06 15:00:59.293	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
77df4295-a1b8-4e58-873b-875b5043fea4	d962acbe-1168-41f7-822a-806ee9b0729a	Bord Amac	Contremaître fluvial	5f7057a8-b5e3-4947-b846-16f62dd43d39	\N	\N	\N	\N	\N	f	\N	8	\N	f	2026-09-06 15:00:59.294	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
8f332ed6-859e-48e9-85bd-d8da18d41080	b4c8c6a8-d147-4f42-b12b-74adc397469f	Tessa Kaorn	Coordinatrice des opérations	850749b4-7031-4dcb-8f1b-ab7fffcea695	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.308	ed9b4b2b-711e-4c23-874c-8623c1dabe4a
ce1d5d3f-2d41-41b4-9edf-6dfd9392c547	d962acbe-1168-41f7-822a-806ee9b0729a	Faith	Meneuse du Syndicat	53f2f592-f1a7-4a7a-8e69-94f1f7e10392	\N	\N	\N	\N	\N	f	\N	0	\N	f	2026-09-06 15:00:59.282	\N
b3842e7e-c1a3-4a65-b8c4-3b1f2a09b1e4	b4c8c6a8-d147-4f42-b12b-74adc397469f	Lysanne Orfe	Émissaire mondaine	776244d3-5c61-4b5e-afd2-3e926aaef5bd	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.31	ed9b4b2b-711e-4c23-874c-8623c1dabe4a
e10e7a7f-d980-4354-94fb-3cad370adf36	b4c8c6a8-d147-4f42-b12b-74adc397469f	Capitaine Sorne Vask	Capitaine des Marteaux	a4710472-7788-4b90-bd60-337c7c035936	\N	\N	\N	\N	\N	f	\N	4	\N	f	2026-09-06 15:00:59.311	ed9b4b2b-711e-4c23-874c-8623c1dabe4a
8af41786-1206-4e12-b7c1-768a874a6b35	b4c8c6a8-d147-4f42-b12b-74adc397469f	Hulda Brasefer	Maître-forgeronne	a84f9bb6-0ea1-4026-968b-6e7738498699	\N	\N	\N	\N	\N	f	\N	5	\N	f	2026-09-06 15:00:59.312	ed9b4b2b-711e-4c23-874c-8623c1dabe4a
8ab97b78-336f-4687-9272-2fbb1e5e1e42	b4c8c6a8-d147-4f42-b12b-74adc397469f	Orane Ferrand	Agente des convois	8dfca091-e7fd-492a-9e80-3cb51d173580	\N	\N	\N	\N	\N	f	\N	6	\N	f	2026-09-06 15:00:59.314	ed9b4b2b-711e-4c23-874c-8623c1dabe4a
41e1ad94-fab1-4fc3-9794-7a6dbb599742	d9c8c611-2986-4e8c-856f-465fecbcdf16	Dame Elara Brumetaille	Conseillère Émérite	8850bce9-a838-461e-b5f7-596394def846	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.325	5d0bdf3b-89bb-4cd4-ab34-70b38242f740
ed9b4b2b-711e-4c23-874c-8623c1dabe4a	b4c8c6a8-d147-4f42-b12b-74adc397469f	Rany Mullimax	Chef de cellule — « Magistrat de Fer »	93239b41-8dee-4147-bc01-c5f2bdfd4614	\N	\N	\N	\N	\N	f	\N	0	\N	f	2026-09-06 15:00:59.307	\N
503788fe-84ec-4b51-8cd4-6bb5313c61cc	d9c8c611-2986-4e8c-856f-465fecbcdf16	Lady Lyra Astrebois	Capitaine des Archers	380d8316-3a6f-40fc-b9f4-5df799f4cf14	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.327	5d0bdf3b-89bb-4cd4-ab34-70b38242f740
76208b00-98ae-447a-9670-12e302154460	d9c8c611-2986-4e8c-856f-465fecbcdf16	Ser Aric Lancelame	Maître d'Armes	9b39a9d2-cbd1-4169-aec1-80c1e5acfa9d	\N	\N	\N	\N	\N	f	\N	4	\N	f	2026-09-06 15:00:59.328	5d0bdf3b-89bb-4cd4-ab34-70b38242f740
d8aada76-6bf9-4364-adb1-68da4185c858	d9c8c611-2986-4e8c-856f-465fecbcdf16	Serget Halvorn	Officier technique — Fonderie	2f92433f-2dcb-4066-b792-27f69e99c84f	\N	\N	\N	\N	\N	f	\N	5	\N	f	2026-09-06 15:00:59.329	5d0bdf3b-89bb-4cd4-ab34-70b38242f740
4d38c0f5-d6ad-47c7-8f7d-0ccd3cc7c984	d9c8c611-2986-4e8c-856f-465fecbcdf16	Garde des Écus d'Or	Fantassin	97d00715-a9d7-4ad3-9506-1e23a2f6e434	\N	\N	\N	\N	\N	f	\N	6	\N	f	2026-09-06 15:00:59.33	a1a9172e-d54e-4cdd-8541-0f92f7970d76
5e34d671-ccec-4d43-95bf-c0b15f406669	d9c8c611-2986-4e8c-856f-465fecbcdf16	Archer des Écus	Archer	16fd6442-836d-4a3d-a3f5-12d9ce6bfe18	\N	\N	\N	\N	\N	f	\N	7	\N	f	2026-09-06 15:00:59.331	503788fe-84ec-4b51-8cd4-6bb5313c61cc
a238e479-4433-41de-be79-61ecdb622246	62739da4-e5ed-46ef-8345-d0182f80bad3	Dorian Hale	Officier	9a7b6933-5dc5-4e0b-87a1-cf3ac490f268	\N	\N	\N	\N	\N	f	\N	2	\N	f	2026-09-06 15:00:59.341	\N
5d0bdf3b-89bb-4cd4-ab34-70b38242f740	d9c8c611-2986-4e8c-856f-465fecbcdf16	Sir Aldric de Valbourg	Commandant Suprême	682aad82-314b-4061-9254-5793ba89e8be	\N	\N	\N	\N	\N	f	\N	0	\N	f	2026-09-06 15:00:59.324	\N
4a11cc05-1ae5-4ed7-ac6a-15b4974648cf	d962acbe-1168-41f7-822a-806ee9b0729a	Dame Arinthe	Maîtresse des lieux	036cc087-0782-4d13-8cf5-f489d0b0839f	\N	\N	\N	\N	\N	f	\N	2	\N	f	2026-09-06 15:00:59.288	ce1d5d3f-2d41-41b4-9edf-6dfd9392c547
08ca438e-4bae-4d4c-9c13-1aa072e4692d	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	Vittore Mastiggia	Cadet de la maison	9ef5f994-4e2a-4f0f-b443-cac13adf50db	\N	ea00a989-9866-4e0c-9ffe-98ca5a05a11c	0976448b-0fc9-477d-85ba-2067237c84c8	\N	MAN	f	1	0	\N	f	2026-09-04 11:09:12.028	\N
8465a567-427f-4abc-b706-0c1f6529bcd1	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Lira Morven	Ancienne capitaine de la Porte Pourpre	d0556534-e9cd-4984-9336-2bfc2d65330d	\N	\N	\N	\N	\N	f	\N	2	\N	f	2026-09-06 15:00:59.355	\N
f4dda564-e3c8-49b8-8eab-591034525916	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Ikar Doven	Officier	3a3880bc-3274-4229-a6e5-08dc14789e11	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.355	\N
94a15f31-e3c9-47f9-88ac-fc02d680f4a8	26e34441-4c27-4be0-948c-342e42221c41	Mirdobas Filan	Radius Ignis — officier psychique et liaison	e13c1d51-c23d-470d-a222-38bd035041c0	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.379	67148aad-cc62-42bc-861a-374aa9781b52
f56a3bbe-9ac3-49e5-9deb-216fdf2df8b7	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Officier Solarius	Chef d'escouade	7f674dac-162b-4243-8e77-7362d636a241	\N	\N	\N	\N	\N	f	\N	5	\N	f	2026-09-06 15:00:59.357	\N
f2627395-9e59-4dd5-ba60-4e84a5f68304	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Soldat du Soleil Pourpre	Troupe régulière	656809e7-16fc-4426-bea1-e959b3b3ca61	\N	\N	\N	\N	\N	f	\N	6	\N	f	2026-09-06 15:00:59.358	f56a3bbe-9ac3-49e5-9deb-216fdf2df8b7
2022eee9-6b9b-4879-b8e1-343f604ff41c	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Acolyte Pourpre	Recrue endoctrinée	8ef5bbf7-606e-4c5d-a427-57698e1072f8	\N	\N	\N	\N	\N	f	\N	7	\N	f	2026-09-06 15:00:59.359	f56a3bbe-9ac3-49e5-9deb-216fdf2df8b7
a1e18249-3678-4d3a-b6d6-6021712c6f89	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Porte-Flamme Pourpre	Mage de bataille	f05886e6-dc07-490e-bef6-cfadddc95564	\N	\N	\N	\N	\N	f	\N	10	\N	f	2026-09-06 15:00:59.362	\N
c2e863f0-d325-449a-8e5a-b97aa4ba13ba	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Inquisiteur du Soleil Pourpre	Interrogateur	1d1e4325-7323-4b8f-a73c-28a416d31803	\N	\N	\N	\N	\N	f	\N	11	\N	f	2026-09-06 15:00:59.363	\N
586d7fe1-a548-4214-9a3f-2249ee8ee251	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Fanatique Écarlate	Kamikaze rituel	57723973-8294-4642-ac88-6890c04984a7	\N	\N	\N	\N	\N	f	\N	12	\N	f	2026-09-06 15:00:59.364	\N
f3e29eec-0404-4ce4-8db4-b409bfff95d2	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Adeptus de l'Effacement	Agent d’effacement	4168e798-427a-474b-bb0c-cd5b07258f43	\N	\N	\N	\N	\N	f	\N	13	\N	f	2026-09-06 15:00:59.365	\N
7c6030b0-394e-4e70-a34d-d25ada217cd4	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Ékénon Tracx	Capitaine — garde du Roi	d1e9e544-2b9c-453b-b111-190c32add1cb	\N	\N	\N	\N	\N	f	\N	0	\N	f	2026-09-06 15:00:59.352	\N
c460a984-da4f-477b-bd9e-21e31f122385	26e34441-4c27-4be0-948c-342e42221c41	Maître Verel	Relais — La Vigne Noire	4b898112-8241-4622-986f-b38d364315ae	\N	\N	\N	\N	\N	f	\N	5	\N	f	2026-09-06 15:00:59.384	\N
594bc960-51ed-4671-813f-32d3908a2541	99b36b5f-0dc0-4715-8759-283353dcdec8	Deux Nuits	Maître conjurateur	290b1fc7-4fa4-4591-a2e9-bea0cb0e6a5b	\N	\N	\N	\N	\N	f	\N	2	\N	f	2026-09-06 15:00:59.395	\N
67148aad-cc62-42bc-861a-374aa9781b52	26e34441-4c27-4be0-948c-342e42221c41	Pelfort Vanguard	Le Roi — tête du réseau	60ee9017-2f5a-45c6-90ae-e7f253db2093	\N	\N	\N	\N	\N	f	\N	0	\N	f	2026-09-06 15:00:59.377	\N
ac0fb91e-88df-4633-b49f-3fa79f212a70	99b36b5f-0dc0-4715-8759-283353dcdec8	Trois Nuits	Maître devin	c73f7e66-4bad-41b9-89ec-f16db2d8ee91	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.396	\N
a10eb242-a676-426d-8581-987af783cccd	99b36b5f-0dc0-4715-8759-283353dcdec8	Quatre Nuits	Maître enchanteur	b6d601cd-8b88-4656-a0d3-c8fb6c10808d	\N	\N	\N	\N	\N	f	\N	4	\N	f	2026-09-06 15:00:59.398	\N
50821bce-1b04-44f3-a254-5b0ff9d7a9fa	99b36b5f-0dc0-4715-8759-283353dcdec8	Cinq Nuits	Maîtresse illusionniste	b5122e37-4f00-4169-8d83-031c7d3981f5	\N	\N	\N	\N	\N	f	\N	5	\N	f	2026-09-06 15:00:59.399	\N
a3639f15-f8fc-4e4c-9f4b-e45ed1a61477	99b36b5f-0dc0-4715-8759-283353dcdec8	Six Nuits	Maître évocateur	b9fdbf2d-b7cb-4baa-b60b-eaf54dbd8865	\N	\N	\N	\N	\N	f	\N	6	\N	f	2026-09-06 15:00:59.4	\N
875cebc5-6670-4827-97e6-a6efa28aad8f	99b36b5f-0dc0-4715-8759-283353dcdec8	Sept Nuits	Maître transmuteur	da127a39-9689-4b08-a0c7-8467321f650e	\N	\N	\N	\N	\N	f	\N	7	\N	f	2026-09-06 15:00:59.401	\N
902c2766-d535-42e4-9e39-f42509b8e059	99b36b5f-0dc0-4715-8759-283353dcdec8	Huit Nuits	Maître nécromancien	5292d7d4-ab2e-4ddf-83a0-6aa4f78ce713	\N	\N	\N	\N	\N	f	\N	8	\N	f	2026-09-06 15:00:59.401	\N
96933b25-19d0-4771-acc5-24ca75cbd52f	19bc865c-5575-4446-8836-bf7b78ac00a3	Jillian Riverpipe	Courtière	7633faa3-0a05-46c2-84ef-2af359ecddbd	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.411	\N
63571dd7-6fa9-4aac-a83d-67b89dd27723	99b36b5f-0dc0-4715-8759-283353dcdec8	Une Nuit	Maître abjurateur	2237610a-899b-4f8b-8c6c-0ad0b7f50fba	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.393	\N
5d853980-3cf9-44bb-808a-4bd72f6cd6f4	19bc865c-5575-4446-8836-bf7b78ac00a3	Veda Karom	Contact Braise	abea18f1-9c07-449b-ab79-775016062e80	\N	\N	\N	\N	\N	f	\N	2	\N	f	2026-09-06 15:00:59.412	\N
5b2461f5-6384-4be8-8f2a-8963dffd3c1f	19bc865c-5575-4446-8836-bf7b78ac00a3	Darn Fer-Vallée	Garde Tovalis	7a98f51c-2382-4a3c-9972-d28bd933e25c	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.413	\N
ee080851-9b62-4b4e-bf04-9196e2cb5310	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Mirdobas Filan	Radius Ignis — officier psychique, liaison Œil Pourpre	e13c1d51-c23d-470d-a222-38bd035041c0	\N	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-06 15:00:59.353	\N
2cef4210-014c-40e1-af23-c7f76077a71a	19bc865c-5575-4446-8836-bf7b78ac00a3	Faith	Meneuse (Syndicat)	53f2f592-f1a7-4a7a-8e69-94f1f7e10392	\N	\N	\N	\N	\N	f	\N	0	\N	f	2026-09-06 15:00:59.41	\N
6e8293de-0f3b-445d-b9f4-194d28dafb2e	62739da4-e5ed-46ef-8345-d0182f80bad3	Soldat type — Main du Silence	Troupe (~18)	6770be44-0782-4653-980a-925ff9676607	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.342	ab6276d4-33cc-4eaa-8589-55f127fe48cd
a7c2102a-63b6-4bda-b79d-4961d6fbae11	62739da4-e5ed-46ef-8345-d0182f80bad3	Vétéran type — Main du Silence	Vétérans (~2)	c5b0da05-e204-4613-9e64-cf5aad95f53b	\N	\N	\N	\N	\N	f	\N	4	\N	f	2026-09-06 15:00:59.343	ab6276d4-33cc-4eaa-8589-55f127fe48cd
08d36c2e-e58f-431f-a06e-d20ded919665	62739da4-e5ed-46ef-8345-d0182f80bad3	Éclaireur type — Main du Silence	Éclaireurs (~4)	110efc91-cda4-49e9-8633-f1c68bb51010	\N	\N	\N	\N	\N	f	\N	5	\N	f	2026-09-06 15:00:59.344	543c140a-6d9f-43d7-beab-38d9d73b7a04
ab6276d4-33cc-4eaa-8589-55f127fe48cd	62739da4-e5ed-46ef-8345-d0182f80bad3	Kaelen Voss	Commandant — « Voix Silencieuse »	cea2b827-0f64-4644-b53a-934619178521	\N	\N	\N	\N	\N	f	\N	0	\N	f	2026-09-06 15:00:59.339	\N
c893fe78-6293-48ec-a046-59c614339cff	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Gardien du Brasier	Élite lourde — garde des officiers	df59f6a7-ad3b-4e8c-b767-2e58b4bdade9	\N	\N	\N	\N	\N	f	\N	8	\N	f	2026-09-06 15:00:59.36	\N
17115bba-19f4-4e1a-9ee8-a32c92368778	5afa840b-b4d3-4657-bdce-9c75c88d91b6	Lame Incandescente	Assassin / éclaireur	3619cf19-1247-487a-90e9-809a5f7151cc	\N	\N	\N	\N	\N	f	\N	9	\N	f	2026-09-06 15:00:59.361	\N
778e121a-70bc-4629-a53b-2232c11d3307	26e34441-4c27-4be0-948c-342e42221c41	Prêtre déchu Voren Kahl	Prêtre déchu	11bbab3d-082b-4d21-99bc-2295684d1ee2	\N	\N	\N	\N	\N	f	\N	3	\N	f	2026-09-06 15:00:59.381	\N
0f55a282-a0c7-430c-8edb-8cb606aa4727	26e34441-4c27-4be0-948c-342e42221c41	Regalio Regani	Couverture mondaine	3037c0fe-d341-42a8-8eaa-3706786a5ed2	\N	\N	\N	\N	\N	f	\N	4	\N	f	2026-09-06 15:00:59.383	\N
da563a1f-603f-48cb-bbea-2d2913585737	b4c8c6a8-d147-4f42-b12b-74adc397469f	Odon Pince	Collecteur — « Trois-Coups »	e4a4f098-636f-4886-9888-e4292ad62361	\N	\N	\N	\N	\N	f	\N	7	\N	f	2026-09-06 15:00:59.315	8f332ed6-859e-48e9-85bd-d8da18d41080
8dde627e-27e6-40f9-a3f5-e2b03e7b50e3	93afc76d-2b39-4e78-a699-a49c0db36b90	Elerÿna	Propriétaire	\N	67647120-404a-4ad4-84a8-716bda739c6d	\N	\N	\N	WOMAN	f	\N	0	\N	f	2026-09-09 13:27:33.332	\N
ad5ccc1e-ffeb-4ec4-b786-ee267552fe55	93afc76d-2b39-4e78-a699-a49c0db36b90	Illevas	Propriétaire	\N	72c85b73-2ad5-4add-b772-b9e3bf603b3e	\N	\N	\N	\N	f	\N	1	\N	f	2026-09-09 13:27:33.335	\N
6df4ed67-37ba-4505-8d63-a58b68fc0312	93afc76d-2b39-4e78-a699-a49c0db36b90	Sabine Quenot	Cuisinière — « la Louche »	1e41100b-8f76-40d2-8917-849fb35fa1e3	\N	\N	\N	\N	WOMAN	f	\N	11	\N	f	2026-09-09 13:27:33.346	3d5f8d5d-0c0f-46d9-badc-efc73872bf77
7f4906f3-217c-4dbd-9626-7c2c544aed16	93afc76d-2b39-4e78-a699-a49c0db36b90	Core Belan	Barde de maison	e4b5e257-5b43-4992-b7da-1e66bb568c22	\N	\N	\N	\N	MAN	f	\N	10	\N	f	2026-09-09 13:14:27.066	3d5f8d5d-0c0f-46d9-badc-efc73872bf77
3d5f8d5d-0c0f-46d9-badc-efc73872bf77	93afc76d-2b39-4e78-a699-a49c0db36b90	Miravosk	Homme de confiance — administre la Loutre	38b3360c-8a20-408c-ada3-195cbb1fe0eb	\N	\N	\N	\N	MAN	f	\N	5	\N	f	2026-09-09 13:27:33.348	\N
77d5056d-2220-4287-994d-8528c22286ea	93afc76d-2b39-4e78-a699-a49c0db36b90	Grazh	Portier / videur	385cd5b3-4dc9-4215-9bc5-56d3f3de8aa7	\N	\N	\N	\N	MAN	f	\N	12	\N	f	2026-09-09 14:00:27.696	3d5f8d5d-0c0f-46d9-badc-efc73872bf77
ac637d8f-d8d1-4b66-b7d3-24c000bf451d	93afc76d-2b39-4e78-a699-a49c0db36b90	Ezbehar	Propriétaire	\N	2da178f3-02a1-4383-ad8a-826c25097092	\N	\N	\N	\N	f	\N	4	\N	f	2026-09-09 13:27:33.343	\N
\.


--
-- Data for Name: GameSession; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."GameSession" (id, date, title, summary, "createdAt", "updatedAt", "campaignId") FROM stdin;
de3c0a70-c5cb-4645-b6bf-c41df328300d	2026-07-10 00:00:00	L'embuscade du hameau	Neuf Nuits arrive dans un hameau où stationne une patrouille de la Main du Silence ; un fermier le cache dans sa ferme. Un corbeau à l'œil violet sur le front observe la maison — Sylvae Irithiel, grande druide des Beor Khan, sous forme animale. Dans la nuit, des cavaliers Beor Khan menés par Drogan Kharvek attaquent le campement de la patrouille et la décime. Le groupe se retrouve repéré par les nomades.	2026-07-10 19:58:49.033	2026-08-22 12:11:38.953	e30a0303-cbac-4684-956a-a19ff6d1e761
8ce7f712-62fc-4761-91ad-e591bf564bad	2026-08-23 00:00:00	Le Fretin — l’assaut du repaire	Assaut du repaire du Fretin, dans les égouts de la Porte Basse. Bilan de la soirée :\n\n— Le Vampirien (escorte de Nharivum) a été tué.\n— Sélas Vharkorn, l'émissaire vampire, s'est échappé par une porte dimensionnelle.\n— Vittore Mastiggia a fui mais Ezbehar l'a pris en chasse ; acculé, il a dégainé un parchemin de Boule de feu — dont l'explosion l'a laissé inconscient.\n— Libération de Darn Fer-Vallée (retenu par la bande) et d'un drakéide qui servait de « modèle d'exposition ».\n— Popox a quitté le groupe pour suivre une colonie de rats (départ du personnage).\n\nTrouvaille : un contrat de livraison Mastiggia ↔ Nharivum, indiquant qu'il s'agissait du 6e chargement, pour un total de 50 unités « équivalent modèle ».	2026-08-23 21:41:14.844	2026-08-23 21:41:14.844	b53a0e0e-f892-40bc-add4-08714b7c88ce
4653e26b-1483-4fb6-8fb2-7ee3bc0a63e5	2026-08-31 00:00:00	Maître Ulric Brumel — l’offre pour Eldric Rigart	Les PJ rencontrent Maître Ulric Brumel.\n\nIl les félicite d'avoir survécu à l'embuscade des Cilovard, puis leur offre le thé et des biscuits avant d'en venir au fait.\n\nCe qu'il révèle :\n— Les Cilovard ont approché Haldor pour un contrat.\n— Haldor s'est débarrassé de Victus en échange d'un apport massif d'argent et de parts de la société.\n— Depuis, les Cilovard ont grappillé les parts petit à petit : ils détiennent aujourd'hui 49 % de Rigart & fils (rebaptisée « Victus & fils »).\n— Eldric Rigart est enfermé et sert de pantin aux Cilovard.\n\nSa proposition :\n— Libérez Eldric : en échange, il vous cédera avec plaisir l'entièreté de ses parts de Rigart & fils (« Victus & fils »).\n— Mieux : si vous mettez la main sur le contrat signé par Haldor, les parts détournées reviennent de droit à Eldric — et donc à vous. Un revers majeur pour les Cilovard.\n\nOù le trouver : Eldric est retenu dans les geôles de la famille Cilovard, sur l'île.	2026-08-31 14:09:33.969	2026-08-31 14:09:33.969	b53a0e0e-f892-40bc-add4-08714b7c88ce
1263bbc5-05f5-41bc-842f-a3053270934c	2026-09-07 00:00:00	La Loutre SAOUL — du captif aux marches du bal	Nuit du 29 Astralys :\n\n— Le captif trouvé avec le Fretin a été ramené dans le sous-sol de la Loutre SAOUL, en attendant que La Braise s'en occupe.\n— Odon Pince est passé collecter la taxe du Conseil d'Acier. Les PJ lui ont fait bonne impression. Illevas lui a remis la dague de l'assassin de l'Orette ; Odon Pince est très intrigué il va essayé d'intercéder en la faveur des PJ. Mais le conseille va avoir définitivement leur intérêt sur eux.\n— Ezbehar et Core Belan ont eu une relation intime pendant la soirée d'ouverture de la Loutre SAOUL, où le barde jouait.\n\nMatin du 30 Astralys :\n\n— À son réveil, Illevas reçoit à la Loutre SAOUL la visite du Roi Pelfort Vanguard, venu récupérer en personne le captif descendu au sous-sol la veille et menacé les PJ "il n'y aura qu'un avertissement".\n\nReste du 30 Astralys :\n\n— Illevas lance deux Sending à Eldric Rigart : il vient le chercher dans les jours qui viennent, et lui demande s'il est motivé.\n— Le groupe va chercher ses tenues pour le bal des Tovalis.\n\n1er Glacialys :\n\n— Au matin, Illevas rencontre Maître Ulric Brumel : le contrat se trouve au 2e étage du manoir des Cilovard.\n— Les PJ viennent d'arriver au bal et s'apprêtent à descendre les escaliers.	2026-09-09 13:14:27.072	2026-09-09 13:21:53.107	b53a0e0e-f892-40bc-add4-08714b7c88ce
\.


--
-- Data for Name: Kingdom; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Kingdom" (id, name, population, description, "dateInGame", color, "isForDM", flag, "borderPoints") FROM stdin;
4d37eed1-161e-4156-970c-381793c3d614	Dominion de L'Antre	75000	Histoire :\nNation majoritairement drakonien elle fut vassalisée par les duchés Dolomite après que les grands dragons chromatiques se soient retirés des affaires des mortels. \nLe Grand blocus maritime de l’an 1006 à fait céder l’Antre.\nEconomie :\nComment le système économique fonctionne ?\n\tExport de minerai avec les duché, les cités libres et Gandorennes.\nQuelles sont les ressources les plus précieuses ?\n\tLe Fer-dragon\nComment les ressources sont vendues ?\n\tLe Fer-dragon, le cuivre, le fer, quelques peau d'animaux\nQuelles sont les régions les plus riches ?\n\tL’Est/Sud-Est\nReligion :\n\ndieux/déesses des religions du monde ?\nTiamat le dieu dragon\nMyths and Legends ?\n\tUn jour drakonien réveillera Tiamat de sa torpeur et unira les dragon\nPrincipaux idéal ou principes ?\n\tL’orgueil \nPossible tentions entre les religions ? guerre ?\n\tTension entre les religions et le culte de Tiamat\nMagie :\nQuasiment que des ensorceleurs avec une “école” pour les former.\nExecutive :\nSystème des gouvernements ? \nUne royauté.\nQui à le pouvoir ? et comment il s’échange ?\nLe Roi Tonur 17eme du nom. Le pouvoir se transmet de père en fils et il prend le nom de Tonur.\nComment les lois sont gérées ?\nPar décret royal. \nQui gère l'application de la loi ? \nLe maire des villes, les chevaliers et miliciens.\nTopologie : \nZone géographique remarquable ?\n\tChaîne de montagne (les crocs du dragon)\nComment les ressources naturelles sont-elles disponibles ?\n\tLa Chasse, le minage et raffinement (pour le Fer-Dragon)\nComment la géolocalisation influe-t-elle sur la survie des cultures ? \n\tInsulaire donc ils vivent donc quasiment en auto suffisance.\nInhabitant :\nCombien de races intelligentes vivent dans le monde ? Comment interagissent- elles entre elles ?\nToutes mais peu de Gnome car mal vu après la vassalisation.\nCulture :\nQuelle est la fonctionnalité ou différence entre les cultures ?\n\tUn peuple très uni assez méfiant des étrangers.\nChef d'œuvre dans l’arts / littérature / architecture  ?\n\tLe sanctuaire au dragon taillé à même dans la montagne \nQuel conflit il y a dans votre société ?  de gros conflits  ? récurrent ?\n\tPas mal de tension entre Drakonien/Gnome \nQuels effets ces conflits ont sur le monde ?\n\tBeaucoups de rixe/raquette ciblé en les 2 races \nSociété :\nQuelles sont les races les plus importantes  ?\nLes Drakonien/Gnome.\nQui sont les moins ?\nLes autres.\nComment elle coexiste ensemble ?\nMal tension entre Drakonien/Gnome	0104-05-21 23:50:39	#e9631c	f	/flag/Le_Dominion_De_L'Antre.png	[[0.1708275862068966, 0.3553240740740741], [0.166551724137931, 0.3511284722222222], [0.1635862068965517, 0.3449074074074074], [0.1627586206896552, 0.3402777777777778], [0.1602758620689655, 0.337037037037037], [0.1569655172413793, 0.3314814814814815], [0.1531034482758621, 0.3277777777777778], [0.1533793103448276, 0.3229166666666667], [0.152551724137931, 0.3166666666666667], [0.1542068965517241, 0.3118055555555556], [0.1522758620689655, 0.3076388888888889], [0.1497931034482759, 0.299537037037037], [0.1423448275862069, 0.2909722222222222], [0.1382068965517241, 0.2835648148148148], [0.1346206896551724, 0.2773148148148148], [0.136551724137931, 0.2710648148148148], [0.1343448275862069, 0.2671296296296296], [0.1321379310344828, 0.2599537037037037], [0.1335172413793103, 0.2537037037037037], [0.1376551724137931, 0.244212962962963], [0.1384827586206896, 0.2372685185185185], [0.1390344827586207, 0.2303240740740741], [0.1409655172413793, 0.2233796296296296], [0.143448275862069, 0.2143518518518518], [0.1431724137931034, 0.20625], [0.1451034482758621, 0.1946759259259259], [0.1481379310344828, 0.1900462962962963], [0.1550344827586207, 0.1884259259259259], [0.159448275862069, 0.1824074074074074], [0.1644137931034483, 0.1780092592592593], [0.1652413793103448, 0.1826388888888889], [0.1710344827586207, 0.18125], [0.1746206896551724, 0.1787037037037037], [0.1782068965517241, 0.174537037037037], [0.1831724137931035, 0.1729166666666667], [0.1855172413793103, 0.1696180555555556], [0.1846896551724138, 0.1678819444444444], [0.1863448275862069, 0.1666666666666667], [0.1893793103448276, 0.1679976851851852], [0.1921379310344828, 0.1673032407407407], [0.1948965517241379, 0.1672453703703704], [0.2027586206896552, 0.1612268518518518], [0.2071724137931034, 0.1585648148148148], [0.2135172413793104, 0.1538194444444445], [0.2168275862068965, 0.1478009259259259], [0.2198620689655172, 0.1446759259259259], [0.2220689655172414, 0.1445601851851852], [0.2275862068965517, 0.1387731481481481], [0.2306206896551724, 0.1371527777777778], [0.2342068965517241, 0.1304398148148148], [0.2358620689655172, 0.1269675925925926], [0.2377931034482759, 0.1241898148148148], [0.24, 0.1203703703703704], [0.2423448275862069, 0.1179398148148148], [0.2449655172413793, 0.1179398148148148], [0.247448275862069, 0.1167824074074074], [0.2489655172413793, 0.1150462962962963], [0.251448275862069, 0.1123842592592593], [0.2546206896551724, 0.112962962962963], [0.2598620689655172, 0.1137731481481482], [0.2616551724137931, 0.1166666666666667], [0.2623448275862069, 0.1226851851851852], [0.2626206896551724, 0.1283564814814815], [0.2667586206896552, 0.1331018518518519], [0.271448275862069, 0.1365740740740741], [0.2707586206896552, 0.1414351851851852], [0.2716551724137931, 0.1436631944444444], [0.2704827586206897, 0.146875], [0.270896551724138, 0.1484664351851852], [0.2711034482758621, 0.1493923611111111], [0.2712068965517241, 0.1552951388888889], [0.2715862068965517, 0.1563946759259259], [0.2715862068965517, 0.1586516203703704], [0.2710689655172414, 0.1605613425925926], [0.2699310344827586, 0.1625], [0.2701379310344827, 0.1643229166666667], [0.2714137931034483, 0.1671006944444444], [0.272, 0.1693865740740741], [0.2733448275862069, 0.1698206018518519], [0.2737586206896552, 0.1727141203703704], [0.2741724137931035, 0.1757233796296296], [0.2745517241379311, 0.1780960648148148], [0.2757586206896552, 0.1794560185185185], [0.2760344827586207, 0.1809027777777778], [0.2760689655172414, 0.1826388888888889], [0.2753448275862069, 0.18359375], [0.2757586206896552, 0.1887152777777778], [0.2763103448275862, 0.19140625], [0.2767241379310345, 0.1920717592592593], [0.2768620689655172, 0.1945891203703704], [0.2772068965517241, 0.1949074074074074], [0.2771034482758621, 0.1982638888888889], [0.2761379310344828, 0.199537037037037], [0.276, 0.201244212962963], [0.2747931034482758, 0.2016493055555555], [0.2735862068965517, 0.2029224537037037], [0.2732758620689655, 0.2039351851851852], [0.271551724137931, 0.2054976851851852], [0.2688275862068966, 0.209837962962963], [0.2666551724137931, 0.2119212962962963], [0.2654137931034483, 0.2137152777777778], [0.2638275862068966, 0.2142650462962963], [0.2623103448275862, 0.2154513888888889], [0.2621724137931035, 0.2162615740740741], [0.2610344827586207, 0.2164351851851852], [0.2598275862068966, 0.217650462962963], [0.2581379310344827, 0.2190104166666667], [0.2551724137931035, 0.222337962962963], [0.2551034482758621, 0.2240740740740741], [0.2530689655172414, 0.2267071759259259], [0.2515862068965517, 0.2278645833333333], [0.2502758620689655, 0.2296006944444444], [0.2490344827586207, 0.232349537037037], [0.2491379310344828, 0.2340277777777778], [0.2499310344827586, 0.2353587962962963], [0.2492413793103448, 0.2365162037037037], [0.248, 0.2365740740740741], [0.2465862068965517, 0.2363425925925926], [0.2459310344827586, 0.2369791666666667], [0.2449310344827586, 0.2374710648148148], [0.2451379310344828, 0.2389756944444444], [0.2432413793103448, 0.2396990740740741], [0.2439655172413793, 0.2407986111111111], [0.243, 0.2417534722222222], [0.2423793103448276, 0.2441550925925926], [0.2414137931034483, 0.2447048611111111], [0.2414827586206897, 0.2461516203703704], [0.2398965517241379, 0.2464988425925926], [0.2399310344827586, 0.2473090277777778], [0.2407241379310345, 0.2474537037037037], [0.2402758620689655, 0.2484664351851852], [0.2406206896551724, 0.2491319444444444], [0.2402413793103448, 0.2497974537037037], [0.2393793103448276, 0.2500289351851852], [0.2394827586206897, 0.2513310185185185], [0.2399655172413793, 0.2541377314814815], [0.2407931034482759, 0.2555266203703704], [0.2413793103448276, 0.2565104166666667], [0.2401724137931034, 0.2576967592592593], [0.2402068965517241, 0.2592013888888889], [0.240551724137931, 0.2627604166666667], [0.24, 0.263744212962963], [0.2388620689655172, 0.2633969907407407], [0.2386551724137931, 0.2629050925925926], [0.2372413793103448, 0.2647280092592593], [0.2368275862068966, 0.2663483796296297], [0.2366551724137931, 0.2674189814814815], [0.2358620689655172, 0.2684895833333333], [0.2347931034482759, 0.2716145833333333], [0.2332068965517241, 0.2718460648148148], [0.2327931034482759, 0.275144675925926], [0.2340344827586207, 0.2767361111111111], [0.2361034482758621, 0.2768807870370371], [0.2356551724137931, 0.280005787037037], [0.2346551724137931, 0.2819733796296297], [0.2341379310344828, 0.2830729166666667], [0.2350689655172414, 0.2844907407407408], [0.2351379310344828, 0.2874131944444445], [0.2337586206896552, 0.290625], [0.2337931034482759, 0.292650462962963], [0.2337586206896552, 0.2943576388888889], [0.2312758620689655, 0.2949652777777778], [0.2301034482758621, 0.2945023148148148], [0.2287931034482759, 0.2944444444444445], [0.2272758620689655, 0.2944155092592592], [0.2243448275862069, 0.2953125], [0.2241724137931035, 0.2976273148148148], [0.2257931034482759, 0.298900462962963], [0.2262413793103448, 0.3027488425925926], [0.2261724137931035, 0.3048321759259259], [0.2220689655172414, 0.3115740740740741], [0.2215862068965517, 0.3141493055555555], [0.2210344827586207, 0.3157986111111111], [0.2189655172413793, 0.3174768518518519], [0.2182413793103448, 0.3184606481481482], [0.2168965517241379, 0.3177083333333333], [0.2108275862068965, 0.3177372685185185], [0.2054137931034483, 0.318113425925926], [0.2033103448275862, 0.3200520833333333], [0.204, 0.3233217592592593], [0.2035172413793103, 0.3252025462962963], [0.2036206896551724, 0.3263599537037037], [0.2017241379310345, 0.3292824074074074], [0.202, 0.3300636574074074], [0.1982413793103448, 0.3328993055555556], [0.1972413793103448, 0.3321759259259259], [0.1958620689655172, 0.3321469907407407], [0.1944137931034483, 0.3327256944444444], [0.1922068965517241, 0.3342881944444445], [0.1882758620689655, 0.3377025462962963], [0.1873103448275862, 0.3379050925925926], [0.1866896551724138, 0.3388310185185185], [0.1852413793103448, 0.3403356481481482], [0.1843103448275862, 0.3421296296296296], [0.1832413793103448, 0.3427951388888889], [0.1828965517241379, 0.3442129629629629], [0.1811724137931034, 0.3464409722222222], [0.1799310344827586, 0.3467013888888889], [0.179448275862069, 0.3480902777777778], [0.177551724137931, 0.3494502314814815], [0.1776896551724138, 0.3506365740740741], [0.177, 0.3519965277777778], [0.1765862068965517, 0.3530381944444445], [0.1736551724137931, 0.3546585648148148], [0.1722068965517241, 0.3550636574074074]]
e44df0a6-ffda-4e97-8f8b-bd34440f07b4	Le Royaume d'Alberan	300000	Le Royaume d'Alberan est coupé en 2 par une guerre civile au nord les elfes des neiges qui veulent étendre les glaces et au Sud les elfes qui reboisent la région.	0293-09-10 23:50:39	#21a207	f	/flag/Le_Royaume_D'Alberan.png	[[[0.3409655172413793, 0.8648148148148148], [0.334896551724138, 0.8552083333333333], [0.3297931034482758, 0.8511574074074074], [0.3251034482758621, 0.843287037037037], [0.320551724137931, 0.8369212962962963], [0.3150344827586207, 0.8305555555555556], [0.3124137931034483, 0.8253472222222222], [0.3128275862068965, 0.8203703703703704], [0.3140689655172414, 0.8141203703703703], [0.3151724137931035, 0.8086805555555555], [0.3292413793103448, 0.7980324074074074], [0.3351724137931035, 0.7914351851851852], [0.3387586206896552, 0.7820601851851852], [0.3365517241379311, 0.7771990740740741], [0.3365517241379311, 0.7736111111111111], [0.3390344827586207, 0.7685185185185185], [0.3428965517241379, 0.7645833333333333], [0.3466206896551724, 0.7594907407407407], [0.3471724137931034, 0.7538194444444445], [0.3459310344827586, 0.7475694444444444], [0.3482758620689655, 0.743287037037037], [0.3528275862068965, 0.7391203703703704], [0.3588965517241379, 0.7329861111111111], [0.3620689655172414, 0.7263888888888889], [0.3608275862068965, 0.721412037037037], [0.3588965517241379, 0.7178240740740741], [0.3633103448275862, 0.7070601851851852], [0.3644137931034483, 0.7054398148148148], [0.3659310344827586, 0.7130787037037037], [0.3675862068965517, 0.716550925925926], [0.3750344827586207, 0.71875], [0.3768275862068965, 0.7268518518518519], [0.3771034482758621, 0.7366898148148148], [0.3782068965517241, 0.7416666666666667], [0.3817931034482759, 0.7416666666666667], [0.3857931034482759, 0.740625], [0.3902068965517241, 0.7434027777777777], [0.3921379310344827, 0.7465277777777778], [0.3957241379310345, 0.7484953703703704], [0.3998620689655172, 0.749537037037037], [0.4053793103448276, 0.7512731481481482], [0.4096551724137931, 0.7532407407407408], [0.4100689655172414, 0.7560185185185185], [0.4136551724137931, 0.7579861111111111], [0.4168275862068965, 0.7619212962962963], [0.4186206896551724, 0.7671296296296296], [0.4182068965517242, 0.7699074074074074], [0.4168275862068965, 0.774537037037037], [0.4158620689655173, 0.7797453703703704], [0.4121379310344828, 0.7833333333333333], [0.4086896551724138, 0.7866898148148148], [0.4059310344827586, 0.7924768518518519], [0.4034482758620689, 0.7988425925925926], [0.4020689655172414, 0.8034722222222223], [0.4037241379310345, 0.8065972222222222], [0.4044137931034483, 0.8099537037037037], [0.4038620689655172, 0.8167824074074074], [0.4015172413793103, 0.825], [0.4008275862068966, 0.8290509259259259], [0.4027586206896552, 0.8314814814814815], [0.404, 0.8363425925925926], [0.4074482758620689, 0.8386574074074075], [0.4077241379310345, 0.8421296296296297], [0.4078620689655172, 0.8471064814814815], [0.4099310344827586, 0.8501157407407407], [0.4147586206896552, 0.8540509259259259], [0.4187586206896552, 0.8570601851851852], [0.4212413793103448, 0.858912037037037], [0.4231724137931034, 0.8645833333333334], [0.4266206896551724, 0.8679398148148149], [0.4307586206896551, 0.8713541666666667], [0.4332413793103448, 0.8726273148148148], [0.4353103448275862, 0.8769675925925926], [0.4363448275862069, 0.8783564814814815], [0.4395172413793104, 0.8788773148148148], [0.442551724137931, 0.8809606481481481], [0.4457931034482759, 0.8835069444444444], [0.4504827586206896, 0.8848958333333333], [0.4548275862068966, 0.8856481481481482], [0.4573793103448276, 0.8878472222222222], [0.4613793103448276, 0.8918402777777777], [0.4662068965517241, 0.8940972222222222], [0.4685517241379311, 0.8953125], [0.4718620689655172, 0.897800925925926], [0.4762068965517242, 0.9019097222222222], [0.4773103448275862, 0.9038773148148148], [0.4722758620689655, 0.9027777777777778], [0.4711034482758621, 0.903587962962963], [0.4684137931034483, 0.9041666666666667], [0.4681379310344828, 0.90625], [0.4695862068965517, 0.9070023148148149], [0.4699310344827586, 0.9085648148148148], [0.4713793103448276, 0.9094907407407408], [0.4735172413793103, 0.9140625], [0.4731724137931034, 0.9155671296296296], [0.4723448275862069, 0.9166666666666666], [0.4713103448275862, 0.9186921296296297], [0.4691034482758621, 0.9190972222222222], [0.4648275862068966, 0.9179976851851852], [0.4622068965517241, 0.9183449074074074], [0.4595862068965517, 0.9201388888888888], [0.456896551724138, 0.9219328703703704], [0.4515172413793103, 0.9277199074074074], [0.4492413793103448, 0.9280092592592593], [0.4480689655172414, 0.9295138888888889], [0.4477241379310345, 0.9316550925925926], [0.4490344827586207, 0.9333912037037037], [0.4497931034482759, 0.9346643518518518], [0.4497931034482759, 0.9371527777777777], [0.4484137931034483, 0.9384837962962963], [0.4484827586206896, 0.9395833333333333], [0.4488275862068966, 0.940625], [0.4468965517241379, 0.9436921296296297], [0.444, 0.9462384259259259], [0.4426896551724138, 0.9475694444444445], [0.4375172413793104, 0.9489583333333333], [0.4337931034482759, 0.9500578703703704], [0.4311724137931034, 0.9512152777777778], [0.4224827586206897, 0.9533564814814814], [0.4177931034482759, 0.9545717592592593], [0.4137241379310345, 0.9547453703703703], [0.412, 0.954224537037037], [0.4095862068965517, 0.9552083333333333], [0.4063448275862069, 0.9555555555555556], [0.4009655172413793, 0.9557291666666666], [0.398, 0.9575231481481481], [0.3879310344827586, 0.9580439814814815], [0.3861379310344827, 0.9581018518518518], [0.3817241379310345, 0.9565393518518519], [0.3799310344827586, 0.9554976851851852], [0.378, 0.955787037037037], [0.3766896551724138, 0.9556134259259259], [0.3752413793103448, 0.9564814814814815], [0.3613448275862069, 0.9563078703703703], [0.359, 0.9561342592592592], [0.3578275862068965, 0.9571180555555555], [0.3553793103448276, 0.956568287037037], [0.3470344827586207, 0.9552083333333333], [0.3447931034482759, 0.9536168981481481], [0.3367241379310345, 0.9513599537037037], [0.3351379310344828, 0.9495659722222223], [0.3303448275862069, 0.94765625], [0.3272413793103448, 0.9454282407407407], [0.3246206896551724, 0.9433449074074074], [0.3227586206896552, 0.9392361111111112], [0.3238620689655172, 0.9361689814814815], [0.3232413793103448, 0.9332175925925926], [0.3258620689655172, 0.9288194444444444], [0.3259310344827586, 0.9255208333333333], [0.327448275862069, 0.9239004629629629], [0.3263448275862069, 0.9209490740740741], [0.3263448275862069, 0.9185763888888889], [0.3244827586206896, 0.9177083333333333], [0.3219310344827586, 0.9181712962962963], [0.3204137931034483, 0.9185763888888889], [0.3193793103448276, 0.9168402777777778], [0.3199310344827586, 0.9150462962962963], [0.3222758620689655, 0.911400462962963], [0.3246896551724138, 0.9107638888888889], [0.3258620689655172, 0.9075810185185185], [0.3267586206896552, 0.9033564814814815], [0.3283448275862069, 0.9025462962962963], [0.3281379310344827, 0.9005208333333333], [0.3266896551724138, 0.8960069444444444], [0.3260689655172414, 0.8930555555555556], [0.3242758620689655, 0.8858796296296296], [0.3223448275862069, 0.8827546296296296], [0.3253103448275862, 0.8761574074074074], [0.3277931034482758, 0.8739583333333333], [0.3319310344827586, 0.8714120370370371], [0.3360689655172414, 0.8679976851851852]], [[0.3070344827586207, 0.9497685185185185], [0.3053793103448276, 0.9501157407407408], [0.3026896551724138, 0.9499421296296297], [0.299448275862069, 0.9494212962962963], [0.3000689655172414, 0.9484953703703703], [0.3028275862068965, 0.9472800925925926], [0.3052413793103448, 0.9465856481481482], [0.3102068965517241, 0.9465277777777777], [0.3140689655172414, 0.9467013888888889], [0.3184137931034483, 0.9489004629629629], [0.3138620689655172, 0.9492476851851852], [0.3117931034482759, 0.9488425925925926], [0.3100689655172414, 0.9489004629629629], [0.3084827586206896, 0.9491898148148148]]]
44383b5f-5ed4-4ae8-91ac-2c377928206e	Le Royaume de Gandorènne	350000	Monarchie dirigé d'une main de fer par David IV. (avec ça nouvelle épouse Geani) Elle fut créer il y a 100 ans (par David III), \n\nLa société se base sur un système de castes avec dans l'ordre la noblesse/érudit-mage > Les soldats et le clergé > les gens communs > les humains. \n\nActuellement en guerre froide avec le saint empire Momoritanien. Les 2 forces avance de plus en plus vers un conflit ouvert.\n\nla capital est Gandor et la richesse de l'empire ce fait grâce à l'abondance de denrée alimentaire. Au nord de Gandor beaucoup de plaine sont aménagés en exploitation agricole.\n\nLa population est assez éclectique(sauf Humain) :\n35% Tiffelin\n55% Autres \n10% Humain	\N	#640c0c	f	/flag/Le_Royaume_Gandorènne.png	[[[0.1897931034482759, 0.4208333333333333], [0.2162758620689655, 0.4146990740740741], [0.2355862068965517, 0.4125], [0.2537931034482759, 0.4122685185185185], [0.2667586206896552, 0.4138888888888889], [0.2731034482758621, 0.4145833333333334], [0.2813793103448276, 0.4125], [0.2859310344827586, 0.4122106481481482], [0.2915172413793103, 0.4134259259259259], [0.2943448275862069, 0.415162037037037], [0.2984827586206897, 0.4152777777777778], [0.3049655172413793, 0.4158564814814815], [0.308, 0.4152777777777778], [0.313448275862069, 0.4152777777777778], [0.3160689655172414, 0.4149884259259259], [0.3197241379310345, 0.4181134259259259], [0.3231724137931035, 0.4202546296296296], [0.3263448275862069, 0.4222222222222222], [0.3290344827586207, 0.4248263888888889], [0.3321379310344827, 0.4300925925925926], [0.3313103448275862, 0.4369212962962963], [0.3263448275862069, 0.4420138888888889], [0.3251034482758621, 0.4476851851851852], [0.3231724137931035, 0.4505787037037037], [0.3217931034482759, 0.4587962962962963], [0.32, 0.4646990740740741], [0.3190344827586207, 0.4721064814814815], [0.3201379310344827, 0.4787037037037037], [0.3220689655172414, 0.4839120370370371], [0.3253793103448276, 0.4884259259259259], [0.3302068965517241, 0.4923611111111111], [0.3275862068965517, 0.5010416666666667], [0.326, 0.5083333333333333], [0.3184827586206896, 0.5137152777777778], [0.3082068965517241, 0.5169560185185185], [0.2982068965517242, 0.5212962962962963], [0.2976551724137931, 0.5277777777777778], [0.303448275862069, 0.5361111111111111], [0.3075862068965518, 0.5398148148148149], [0.3169655172413793, 0.54375], [0.3235862068965517, 0.5462962962962963], [0.3282758620689655, 0.5509259259259259], [0.3277241379310345, 0.5571759259259259], [0.3260689655172414, 0.5662037037037037], [0.3238620689655172, 0.5717592592592593], [0.3241379310344827, 0.5789351851851852], [0.3277241379310345, 0.5863425925925926], [0.3302068965517241, 0.594212962962963], [0.3321379310344827, 0.60625], [0.3337931034482758, 0.6099537037037037], [0.336, 0.6131944444444445], [0.3365517241379311, 0.6206018518518519], [0.3357241379310345, 0.6300925925925925], [0.3390344827586207, 0.6342592592592593], [0.3413793103448276, 0.6421296296296296], [0.3452413793103448, 0.647800925925926], [0.3502068965517242, 0.653587962962963], [0.3532413793103448, 0.6572916666666667], [0.3551724137931034, 0.6618055555555555], [0.3572758620689655, 0.6639178240740741], [0.3591379310344828, 0.6672164351851851], [0.360448275862069, 0.6698206018518519], [0.3608965517241379, 0.6706886574074075], [0.3616896551724138, 0.6717303240740741], [0.3623793103448276, 0.6727430555555556], [0.3623793103448276, 0.6751736111111111], [0.3627586206896552, 0.6765335648148149], [0.3631379310344828, 0.6771990740740741], [0.3573793103448276, 0.678125], [0.3531724137931034, 0.6794560185185186], [0.3495172413793103, 0.6803819444444444], [0.3411034482758621, 0.6806712962962963], [0.3358620689655172, 0.68125], [0.3331034482758621, 0.6800347222222223], [0.3297931034482758, 0.6798032407407407], [0.3283448275862069, 0.6763888888888889], [0.3290344827586207, 0.672511574074074], [0.3295862068965517, 0.6704282407407407], [0.333448275862069, 0.6684027777777778], [0.3336551724137931, 0.6628472222222223], [0.33, 0.6611111111111111], [0.3272413793103448, 0.6618055555555555], [0.3262068965517241, 0.6585648148148148], [0.3243448275862069, 0.6560763888888889], [0.3224827586206896, 0.6549189814814815], [0.3209655172413793, 0.6529513888888889], [0.3177931034482759, 0.6514467592592592], [0.3167586206896552, 0.6512152777777778], [0.314, 0.6486689814814814], [0.3098620689655173, 0.6472222222222223], [0.3068965517241379, 0.647337962962963], [0.3050344827586207, 0.6495949074074074], [0.3029655172413793, 0.6494791666666667], [0.3008275862068965, 0.6479166666666667], [0.297448275862069, 0.6465277777777778], [0.2941379310344828, 0.6468171296296297], [0.2920689655172414, 0.6456597222222222], [0.2901379310344828, 0.6464699074074074], [0.2887586206896552, 0.6445601851851852], [0.2852413793103448, 0.6457175925925925], [0.2843448275862069, 0.6455439814814815], [0.2847586206896552, 0.6433449074074075], [0.284, 0.6409722222222223], [0.2811034482758621, 0.6414351851851852], [0.2805517241379311, 0.6424768518518519], [0.2784827586206897, 0.6438078703703703], [0.2785517241379311, 0.6461805555555555], [0.2773103448275862, 0.6463541666666667], [0.2758620689655172, 0.6441550925925926], [0.2745517241379311, 0.6434606481481482], [0.2730344827586207, 0.6418402777777777], [0.2703448275862069, 0.6402199074074074], [0.2691724137931035, 0.6404513888888889], [0.2675862068965517, 0.6393518518518518], [0.2639310344827586, 0.6396990740740741], [0.2612413793103448, 0.6402199074074074], [0.2573103448275862, 0.639988425925926], [0.2539310344827586, 0.6378472222222222], [0.2517931034482759, 0.6379050925925925], [0.2491724137931035, 0.6362847222222222], [0.2481379310344828, 0.6368634259259259], [0.2464827586206897, 0.6369791666666667], [0.244551724137931, 0.638425925925926], [0.2415172413793104, 0.6364004629629629], [0.236551724137931, 0.6348379629629629], [0.2313793103448276, 0.6340856481481482], [0.2271724137931035, 0.6340277777777777], [0.2242758620689655, 0.6320023148148148], [0.2217241379310345, 0.630613425925926], [0.2203448275862069, 0.6299189814814815], [0.218551724137931, 0.6306712962962963], [0.2153793103448276, 0.6297453703703704], [0.2136551724137931, 0.6303819444444444], [0.2097931034482759, 0.6285879629629629], [0.2077931034482759, 0.6264467592592593], [0.2051724137931034, 0.6249421296296296], [0.2015172413793103, 0.6224537037037037], [0.2027586206896552, 0.6212962962962963], [0.2015862068965517, 0.6200810185185185], [0.2032413793103448, 0.6184027777777777], [0.2070344827586207, 0.617824074074074], [0.2089655172413793, 0.6173611111111111], [0.2111724137931034, 0.617650462962963], [0.2151034482758621, 0.6166666666666667], [0.2171724137931035, 0.616087962962963], [0.2187586206896552, 0.6144675925925925], [0.2191724137931035, 0.6115162037037037], [0.2192413793103448, 0.6071180555555555], [0.2202758620689655, 0.6045717592592592], [0.2198620689655172, 0.602662037037037], [0.2184137931034483, 0.5997685185185185], [0.2192413793103448, 0.5968171296296296], [0.2197241379310345, 0.5947916666666667], [0.218551724137931, 0.5939814814814814], [0.2193103448275862, 0.5897569444444445], [0.2186206896551724, 0.5869791666666667], [0.2187586206896552, 0.5851273148148148], [0.2199310344827586, 0.5844907407407407], [0.2203448275862069, 0.5831597222222222], [0.2168965517241379, 0.5734953703703703], [0.2177931034482758, 0.5719907407407407], [0.2196551724137931, 0.5730902777777778], [0.2203448275862069, 0.5711805555555556], [0.218, 0.568113425925926], [0.2131724137931034, 0.5619791666666667], [0.2108275862068965, 0.5608217592592593], [0.2086206896551724, 0.5588541666666667], [0.2082758620689655, 0.5559606481481482], [0.2071034482758621, 0.5555555555555556], [0.2080689655172414, 0.554050925925926], [0.2062758620689655, 0.5508101851851852], [0.206551724137931, 0.5486689814814815], [0.206, 0.5468171296296296], [0.2035862068965517, 0.5452546296296297], [0.2031724137931034, 0.5424189814814815], [0.202551724137931, 0.5407407407407407], [0.2015172413793103, 0.538599537037037], [0.2008965517241379, 0.5369212962962963], [0.2013103448275862, 0.5346643518518519], [0.2004137931034483, 0.531712962962963], [0.2006206896551724, 0.5281828703703704], [0.2006896551724138, 0.5261574074074075], [0.1990344827586207, 0.5230902777777777], [0.200551724137931, 0.51875], [0.2015172413793103, 0.5142939814814815], [0.2016551724137931, 0.5118634259259259], [0.2028275862068966, 0.5086226851851852], [0.2015862068965517, 0.5054976851851852], [0.203448275862069, 0.501099537037037], [0.2051724137931034, 0.5000578703703704], [0.2084137931034483, 0.4984953703703704], [0.2083448275862069, 0.4971064814814815], [0.21, 0.4946180555555555], [0.2106206896551724, 0.4898148148148148], [0.2095862068965517, 0.4876736111111111], [0.2090344827586207, 0.4856481481481482], [0.2086896551724138, 0.4844328703703704], [0.2093793103448276, 0.4830439814814815], [0.2102758620689655, 0.4802662037037037], [0.2113103448275862, 0.477662037037037], [0.2127586206896552, 0.4752893518518518], [0.2111034482758621, 0.4743055555555555], [0.2110344827586207, 0.4713541666666667], [0.2095172413793104, 0.470775462962963], [0.2091034482758621, 0.4682291666666666], [0.2099310344827586, 0.4662037037037037], [0.207448275862069, 0.4590277777777778], [0.2083448275862069, 0.4563657407407408], [0.2098620689655172, 0.4535300925925926], [0.2119310344827586, 0.4503472222222222], [0.2110344827586207, 0.4431712962962963], [0.209448275862069, 0.441724537037037], [0.2088965517241379, 0.4406828703703703], [0.2082758620689655, 0.4389467592592592], [0.2070344827586207, 0.4365740740740741], [0.2055862068965517, 0.4342013888888889], [0.2052413793103448, 0.4322337962962963], [0.2049655172413793, 0.4292824074074074], [0.2035862068965517, 0.4248842592592593], [0.2031724137931034, 0.4216435185185185], [0.1966896551724138, 0.4232638888888889], [0.1915862068965517, 0.424537037037037], [0.1886896551724138, 0.4269675925925926], [0.1855172413793103, 0.427662037037037], [0.1855172413793103, 0.4248842592592593]], [[0.1862068965517241, 0.5168981481481482], [0.188551724137931, 0.5148148148148148], [0.1900689655172414, 0.5128472222222222], [0.188551724137931, 0.5099537037037037], [0.1902068965517241, 0.5083333333333333], [0.1895172413793103, 0.5049768518518518], [0.1896551724137931, 0.5012731481481482], [0.1860689655172414, 0.4995370370370371], [0.1822068965517241, 0.4987268518518518], [0.1772413793103448, 0.4983796296296296], [0.171448275862069, 0.4986111111111111], [0.1675862068965517, 0.4997685185185185], [0.1656551724137931, 0.503125], [0.164, 0.5055555555555555], [0.1713103448275862, 0.5101851851851852], [0.175448275862069, 0.5111111111111111], [0.1788965517241379, 0.5135416666666667], [0.1817931034482759, 0.5136574074074074], [0.184, 0.5159722222222223]], [[0.1623448275862069, 0.6464699074074074], [0.162, 0.6433159722222223], [0.1638620689655172, 0.6407407407407407], [0.1659310344827586, 0.6366898148148148], [0.1671724137931034, 0.6342592592592593], [0.1779310344827586, 0.6318865740740741], [0.1812413793103448, 0.6331597222222223], [0.1783448275862069, 0.6388888888888888], [0.1758620689655172, 0.6408564814814814], [0.1728275862068966, 0.6431712962962963], [0.1688275862068966, 0.6457175925925925], [0.1651896551724138, 0.6470775462962963]]]
6d9412ba-0f6d-41d5-b7b4-13e6549a990d	Le Sultanat de Sandarane	225000	Ce pays situé dans le sud-est de Solenia serait d'après les légendes le premier royaume à avoir été fondé. C'est un pays monarchique gouverné par la famille Alym depuis plus de 400 ans. La population y est majoritairement humaine bien que de moins en moins dû à son ouverture sur le monde. Bien qu'on ne se l'explique pas, les personnes qui en sont originaires ou vécus assez longtemps ont pour spécificité de donner toujours naissance à des jumeaux. Certaines hypothèses avancent qu'il s'agirait d'un élément dans l'air qui modifierait les personnes. D'autres qu'une malédiction ou bénédiction (suivant les point de vue) des dieux à était lancé sur le premier royaume de Solénia à relever de "la longue nuit".\n\nCa géographie quand à elle la coupe en 4 régions : \n\nLa première que l'ont appel "Alfaragh Al'abyad" ou le Vide Blanc, démarre depuis isthme Aljisr qui relie le continent au royaume et s'étend jusqu'au grand fleuve Alhayaa que l'on peu traduire en "La Vie". Elle contint des dunes blanches à perte de vue que seul une poignée de hameau ou de ville vienne interrompre. On y retrouve Mahat la cité forteresse ou transite l'entièreté des caravane marchande entrant dans le pays. Aya-Toumin petite ville nichée au cœur des dunes connue sont monastère dédié à Searinne Dieu de la Lumière et des Ombres et enfin Sulayman dite "la magnifique" deuxième plus grande cité du royaume point central dans l'échange de marchandise.\n\nLa seconde région appelée "Alqalb Akhdar" ou "le Cœur Vert" représente tout le nord du pays. Elle est caractérisée par des plaines verdoyantes et des jungle luxuriante. C'est là que se trouve Sandarane la capitale éponyme appelée aussi la cité au mille cascades de part son système d'irrigation si particulier. C'est là que se trouve le siège du pouvoir ou Moite le juste règne actuellement. Plus au sud se trouve Nyala ville exclusivement orienté vers l'agriculture, elle produit est stockée la majeure partie de la nourriture du pays. Encore au sud se trouve Gizab. Cette petite cité est connue pour sa lutte contre l'avancée du désert en plantant des milliers d'arbres.\n\nLa troisième région est appelé "Al'arkhabil alsama" ou l'archipel du ciel. Elle regroupe toutes les îles au nord. On y trouve des îles entièrement recouvertes de jungle ou des îles parcourues par d'immense chaîne montagne. Trois villes y sont particulièrement connues. Madja connue pour sa scierie et sont travaille du bois. Zametan est quant à elle une petite ville portuaire spécialisée dans la culture de perle et la confection de bijoux et tout au nord (hors maps) Raoued est une ville fortifiée connue pour ses chantier naval à la pointe de la technologie et de la magie.\n\nEnfin la dernière région est le sud-est du royaume appelé "Almawt Al'ahmar" ou la mort rouge à cause de la couleur ocre de ces gigantesques dunes et collines. Les conditions de vie y sont aussi extrêmes avec des écarts de température entre le jour et la nuit de plus 50 degrés et ce sans compter la flore et faune sauvage meurtrière. Seuls quelques groupes de nomades et quelques villes troglodytes y vivent. Il y a Alkwariz-mi ville portuaire a l'entrée du désert rouge, point d'entrée du commerce venue des autres continents. Shur-abak et Al-Kurfrah quant à elle son 2 citées fortement militarisé créé pour contrôler soit l'entrée du canal "Al Gharsa" soit l'extrême sud avec ça faille pas entièrement exploré que l'on appel "Al-Layl" la nuit.\n\nSultan / Sultane (roi / reine)\nSultane validé Titre honorifique porté par la mère du sultan.\nYabgu (prince)\nBeylerbey (duc)\nPacha (marquis)\nBey (comte ou baron)\nAtabeg (régent)\n\nSultan : Alym\n	1958-03-03 23:00:00	#813412	f	/flag/Le_Sultana_de_Sandarane.png	[[[0.8319310344827586, 0.3671875], [0.8322068965517241, 0.3661747685185185], [0.835, 0.3616898148148148], [0.835, 0.3603877314814815], [0.8365172413793104, 0.3574363425925926], [0.8362068965517241, 0.35625], [0.8356896551724138, 0.3552951388888889], [0.8351724137931035, 0.353443287037037], [0.8345862068965517, 0.3521122685185185], [0.8327586206896552, 0.3505208333333333], [0.8326206896551724, 0.3491608796296296], [0.8319655172413793, 0.3482928240740741], [0.8316896551724138, 0.3473958333333333], [0.8310689655172414, 0.3465277777777778], [0.8325862068965517, 0.3450520833333333], [0.8335172413793104, 0.3427951388888889], [0.8346896551724138, 0.3399884259259259], [0.8356206896551724, 0.3392939814814815], [0.8361379310344828, 0.3359085648148148], [0.836, 0.3352430555555556], [0.8355172413793104, 0.3344328703703704], [0.8340689655172414, 0.3324363425925926], [0.832655172413793, 0.3318865740740741], [0.8318965517241379, 0.33046875], [0.8322758620689655, 0.3285300925925926], [0.8318620689655173, 0.3273148148148148], [0.8328965517241379, 0.3250578703703704], [0.8326206896551724, 0.3228009259259259], [0.8352413793103448, 0.3170138888888889], [0.8352413793103448, 0.315625], [0.8342068965517241, 0.3140625], [0.8354482758620689, 0.3117476851851852], [0.8355862068965517, 0.309837962962963], [0.8368275862068966, 0.307349537037037], [0.841103448275862, 0.3053240740740741], [0.8426206896551725, 0.3037615740740741], [0.8415172413793104, 0.3027777777777778], [0.8368275862068966, 0.3015046296296297], [0.8355862068965517, 0.2999421296296296], [0.8327586206896552, 0.2984664351851852], [0.8309310344827586, 0.2966724537037037], [0.8300689655172414, 0.2951967592592593], [0.8296896551724138, 0.2939236111111111], [0.8284137931034483, 0.2920138888888889], [0.8271379310344827, 0.2907407407407407], [0.8267931034482758, 0.2897280092592592], [0.8262068965517242, 0.2888599537037037], [0.8258965517241379, 0.2872395833333333], [0.8264827586206897, 0.2865740740740741], [0.8268275862068966, 0.2859953703703704], [0.826551724137931, 0.2850115740740741], [0.8266206896551724, 0.2837094907407408], [0.8274137931034483, 0.2822627314814815], [0.8282758620689655, 0.2815393518518519], [0.828103448275862, 0.2809606481481481], [0.8278620689655173, 0.2800636574074074], [0.8286896551724138, 0.2793981481481482], [0.828551724137931, 0.2780960648148148], [0.8274482758620689, 0.276099537037037], [0.825655172413793, 0.2760706018518518], [0.8245862068965517, 0.2756944444444445], [0.8244137931034483, 0.2753761574074074], [0.8232068965517242, 0.274681712962963], [0.8226206896551724, 0.2737847222222222], [0.8226551724137932, 0.2727430555555556], [0.8224137931034483, 0.2719039351851852], [0.8214482758620689, 0.2712673611111111], [0.8206206896551724, 0.2704282407407407], [0.8200689655172414, 0.2696180555555556], [0.8198965517241379, 0.2685763888888889], [0.8198965517241379, 0.2675636574074074], [0.8193448275862069, 0.2662037037037037], [0.8185172413793104, 0.2647569444444444], [0.8176206896551724, 0.2636284722222222], [0.8171379310344827, 0.2629918981481482], [0.8168620689655173, 0.2618634259259259], [0.8168965517241379, 0.2605613425925926], [0.8172068965517242, 0.259837962962963], [0.8164827586206896, 0.2593460648148148], [0.8165862068965517, 0.2573206018518518], [0.8170344827586207, 0.2563657407407408], [0.8178275862068966, 0.252806712962963], [0.8183793103448276, 0.2502604166666667], [0.8189310344827586, 0.2484375], [0.8198275862068966, 0.2468460648148148], [0.8209655172413793, 0.2460358796296296], [0.8221724137931035, 0.2454861111111111], [0.8232068965517242, 0.2450520833333333], [0.8246551724137932, 0.2441550925925926], [0.8263103448275863, 0.2427951388888889], [0.8271379310344827, 0.24140625], [0.8258275862068966, 0.2406539351851852], [0.8241724137931035, 0.2411458333333333], [0.8226551724137932, 0.2411747685185185], [0.8218275862068966, 0.2420428240740741], [0.8206896551724138, 0.2424189814814815], [0.8192413793103448, 0.2420138888888889], [0.8175172413793104, 0.2411458333333333], [0.8156206896551724, 0.2410011574074074], [0.8111724137931035, 0.2394965277777778], [0.8096551724137931, 0.2380787037037037], [0.8087931034482758, 0.237181712962963], [0.8083448275862068, 0.2354166666666667], [0.8075517241379311, 0.2330150462962963], [0.8066551724137931, 0.2308159722222222], [0.8064137931034483, 0.2289930555555555], [0.8057241379310345, 0.2274016203703704], [0.8064827586206896, 0.2247685185185185], [0.8068275862068965, 0.2241030092592593], [0.8060689655172414, 0.2238715277777778], [0.8047586206896552, 0.2238136574074074], [0.8038965517241379, 0.2233217592592593], [0.8027931034482758, 0.2231770833333333], [0.801448275862069, 0.2225983796296296], [0.8006206896551724, 0.2200810185185185], [0.8002758620689655, 0.2196469907407407], [0.7992413793103448, 0.2194733796296296], [0.7984827586206896, 0.2187789351851852], [0.7982068965517242, 0.217505787037037], [0.7978620689655173, 0.2166377314814815], [0.7978275862068965, 0.2149884259259259], [0.7975862068965517, 0.2140335648148148], [0.7974137931034483, 0.21328125], [0.7956206896551724, 0.2127025462962963], [0.7945517241379311, 0.2118923611111111], [0.7932068965517242, 0.2103587962962963], [0.7929310344827586, 0.2094328703703704], [0.7926896551724137, 0.2084201388888889], [0.7927586206896552, 0.207349537037037], [0.7936206896551724, 0.2065972222222222], [0.7931379310344827, 0.2046296296296296], [0.7920689655172414, 0.20234375], [0.7914137931034483, 0.2006944444444445], [0.7879655172413793, 0.20078125], [0.7850344827586206, 0.2013599537037037], [0.7814827586206896, 0.2025462962962963], [0.7806896551724138, 0.2028935185185185], [0.7802758620689655, 0.2043113425925926], [0.7819655172413793, 0.2054398148148148], [0.7833103448275862, 0.2063368055555556], [0.7823448275862069, 0.2078703703703704], [0.7806206896551724, 0.2097222222222222], [0.7791379310344828, 0.2099247685185185], [0.7784137931034483, 0.2098668981481482], [0.7766896551724138, 0.21171875], [0.7757241379310345, 0.2120081018518518], [0.7752758620689655, 0.2128761574074074], [0.7737241379310345, 0.2128472222222222], [0.7721724137931034, 0.2131655092592593], [0.770896551724138, 0.2127893518518519], [0.7696551724137931, 0.2128761574074074], [0.7684137931034483, 0.2121527777777778], [0.767551724137931, 0.211400462962963], [0.766448275862069, 0.2108506944444444], [0.7647241379310344, 0.2103587962962963], [0.7627931034482759, 0.2090856481481481], [0.760448275862069, 0.2074652777777778], [0.7594827586206897, 0.2067708333333333], [0.7575862068965518, 0.206568287037037], [0.7557931034482759, 0.2063657407407407], [0.7545862068965518, 0.2056712962962963], [0.752551724137931, 0.2040219907407407], [0.7510689655172413, 0.2024016203703704], [0.7486896551724138, 0.2019386574074074], [0.7470689655172413, 0.2021412037037037], [0.7463103448275862, 0.2005497685185185], [0.7457586206896551, 0.1986111111111111], [0.7474827586206897, 0.1976851851851852], [0.7488275862068966, 0.195775462962963], [0.7501034482758621, 0.1950810185185185], [0.7481724137931034, 0.1892361111111111], [0.7483793103448276, 0.1887731481481481], [0.747551724137931, 0.1885706018518518], [0.7472758620689656, 0.1874710648148148], [0.7476896551724138, 0.1867476851851852], [0.746551724137931, 0.1859953703703704], [0.7466206896551724, 0.1844907407407407], [0.7477241379310345, 0.1830150462962963], [0.7482068965517241, 0.1822627314814815], [0.747551724137931, 0.18125], [0.7479310344827587, 0.1795428240740741], [0.7484137931034482, 0.178587962962963], [0.7492758620689656, 0.1778935185185185], [0.7511724137931034, 0.1778356481481481], [0.7523103448275862, 0.1756365740740741], [0.754, 0.1733506944444445], [0.7542068965517241, 0.1714988425925926], [0.7530689655172413, 0.1704861111111111], [0.7520689655172413, 0.169849537037037], [0.7527586206896552, 0.1642361111111111], [0.7523448275862069, 0.1623263888888889], [0.7532413793103448, 0.1596064814814815], [0.7555862068965518, 0.1603587962962963], [0.7567586206896552, 0.1651041666666667], [0.7588275862068965, 0.1640046296296296], [0.762551724137931, 0.1627314814814815], [0.7682068965517241, 0.1618634259259259], [0.7739310344827586, 0.1622685185185185], [0.775448275862069, 0.1618634259259259], [0.7756551724137931, 0.1596643518518518], [0.776896551724138, 0.1571180555555556], [0.7770344827586206, 0.1559606481481481], [0.7753793103448275, 0.1554398148148148], [0.7731034482758621, 0.1552083333333333], [0.7711724137931034, 0.1527777777777778], [0.7696551724137931, 0.1502893518518519], [0.7704137931034483, 0.1455439814814815], [0.7713793103448275, 0.14375], [0.766896551724138, 0.116087962962963], [0.7689655172413793, 0.10625], [0.7684137931034483, 0.09560185185185185], [0.7691034482758621, 0.08206018518518518], [0.7653793103448275, 0.07569444444444444], [0.7459310344827587, 0.07569444444444444], [0.7340689655172414, 0.05949074074074074], [0.7255172413793104, 0.05208333333333334], [0.7096551724137931, 0.05486111111111111], [0.6946206896551724, 0.0763888888888889], [0.6882758620689655, 0.09872685185185186], [0.6775172413793104, 0.1623842592592593], [0.6802758620689655, 0.1721064814814815], [0.6815172413793104, 0.180787037037037], [0.6801379310344827, 0.1881944444444444], [0.6797241379310345, 0.1956018518518519], [0.6777931034482758, 0.205787037037037], [0.6753103448275862, 0.2130787037037037], [0.6682758620689655, 0.2193287037037037], [0.6602758620689655, 0.2224537037037037], [0.656, 0.2277777777777778], [0.6511724137931034, 0.2320601851851852], [0.6456551724137931, 0.237962962962963], [0.6419310344827586, 0.2420138888888889], [0.6427586206896552, 0.2472222222222222], [0.6464827586206896, 0.2512731481481482], [0.650896551724138, 0.25625], [0.6528275862068965, 0.2585648148148148], [0.6555862068965517, 0.2934027777777778], [0.6497931034482759, 0.3015046296296297], [0.6493793103448275, 0.3045138888888889], [0.6466206896551724, 0.3077546296296296], [0.6463448275862069, 0.3105324074074074], [0.6408275862068965, 0.3149305555555555], [0.6416551724137931, 0.3177083333333333], [0.6427586206896552, 0.3209490740740741], [0.6364137931034483, 0.3275462962962963], [0.632, 0.3328703703703704], [0.6296551724137931, 0.3390046296296296], [0.6246896551724138, 0.3440972222222222], [0.6217931034482759, 0.3458333333333333], [0.6161379310344828, 0.3517361111111111], [0.6133793103448276, 0.3555555555555556], [0.6099310344827586, 0.3583333333333333], [0.617103448275862, 0.368287037037037], [0.6259310344827587, 0.3627314814814815], [0.6350344827586207, 0.3585648148148148], [0.6502068965517241, 0.3576388888888889], [0.6642758620689655, 0.35625], [0.6788965517241379, 0.3569444444444445], [0.6915862068965517, 0.3578703703703704], [0.7012413793103448, 0.3627314814814815], [0.7073103448275863, 0.3696759259259259], [0.7144827586206897, 0.3763888888888889], [0.7219310344827586, 0.3828703703703704], [0.7293793103448276, 0.3918981481481482], [0.7348965517241379, 0.3988425925925926], [0.7420689655172413, 0.4138888888888889], [0.7433793103448276, 0.412962962962963], [0.7479310344827587, 0.4199652777777778], [0.7503448275862069, 0.4219328703703704], [0.7520689655172413, 0.4241319444444445], [0.7533793103448276, 0.4241898148148148], [0.7542758620689655, 0.4263310185185185], [0.7604137931034483, 0.4306134259259259], [0.7642068965517241, 0.4335648148148148], [0.7667586206896552, 0.433912037037037], [0.7683448275862069, 0.4358796296296296], [0.7700689655172414, 0.4368055555555556], [0.7703448275862069, 0.4391203703703704], [0.7701379310344828, 0.4404513888888889], [0.7736551724137931, 0.4427083333333333], [0.7742758620689655, 0.4448495370370371], [0.7747586206896552, 0.4467013888888889], [0.7772413793103449, 0.4494791666666667], [0.7804137931034483, 0.4533564814814815], [0.7825517241379311, 0.4545717592592592], [0.784, 0.4561342592592593], [0.7864137931034483, 0.4579861111111111], [0.7878620689655172, 0.4601273148148148], [0.7902068965517242, 0.4621527777777778], [0.7922068965517242, 0.4651041666666667], [0.7945517241379311, 0.4669560185185185], [0.796, 0.4682291666666666], [0.7997241379310345, 0.4703125], [0.8012413793103448, 0.4711805555555555], [0.8038620689655173, 0.4692129629629629], [0.8044137931034483, 0.4644675925925926], [0.8067586206896552, 0.4644675925925926], [0.8093793103448276, 0.4621527777777778], [0.8088275862068965, 0.459375], [0.8062068965517242, 0.456712962962963], [0.8100689655172414, 0.4549768518518518], [0.8089655172413793, 0.4523148148148148], [0.8081379310344827, 0.4466435185185185], [0.8081379310344827, 0.4423611111111111], [0.8064827586206896, 0.4407407407407408], [0.8049655172413793, 0.4373842592592593], [0.8067586206896552, 0.4335648148148148], [0.8089655172413793, 0.4300925925925926], [0.8125517241379311, 0.4273148148148148], [0.8177931034482758, 0.4172453703703703], [0.8241379310344827, 0.4105324074074074], [0.8271724137931035, 0.4097222222222222], [0.8288275862068966, 0.4069444444444444], [0.8274482758620689, 0.4028935185185185], [0.829655172413793, 0.4001157407407407], [0.8292413793103448, 0.3947916666666667], [0.8313103448275863, 0.3908564814814815], [0.8303448275862069, 0.3855324074074074], [0.8274482758620689, 0.3828703703703704], [0.8262068965517242, 0.3802083333333333], [0.829103448275862, 0.3756944444444444], [0.8313103448275863, 0.371412037037037]]]
0bcb8247-1ea9-48b1-9619-15b5de56ad9c	Le Saint-Empire Momoritanien	420000	Famille royal Kinemor :\nRhendom/Taripica\nCalison/Norima \nLimor * Lauc\nTenabis/Alménia \nYmal\n\nAléthérite :\nLa socité momoritanien évolue autour de Aléthérite un materieau récolté depuis les bois de grand cerf blanc sacré.Il ont était fait en cadeau part le Alion (nature/artisanat) après un coups d’états manqué formenté par un groupe de mages. \n\nIl a comme spécificité de nullifier les pouvoirs de magie d’éther. (tout sauf la magie des clercs)\nAléthérite se retrouve dans les bâtiments dans les armes, armures et accessoires. Elle peut être utilisée comme composé dans des potions qui neutralisent les pouvoirs de concentration.\n\nil y a approximativement 100 troupeaux qui varie entre 50 et 1000 têtes	0671-09-03 23:50:39	#15188a	f	/flag/Le_Saint-Empire_Momoritanien.png	[[[0.5237241379310345, 0.4947337962962963], [0.5138620689655172, 0.4935185185185185], [0.5104137931034483, 0.4918402777777778], [0.5055862068965518, 0.490625], [0.5017931034482759, 0.4935185185185185], [0.4977241379310345, 0.4959490740740741], [0.4877931034482759, 0.4934027777777778], [0.4838620689655173, 0.4888888888888889], [0.4796551724137931, 0.4853587962962963], [0.4714482758620689, 0.4850115740740741], [0.4648275862068966, 0.4863425925925926], [0.4596551724137931, 0.4886574074074074], [0.4544137931034483, 0.4884837962962963], [0.4507586206896552, 0.4843171296296296], [0.4524827586206897, 0.4819444444444445], [0.4521379310344827, 0.4782407407407407], [0.4521379310344827, 0.474537037037037], [0.4513103448275862, 0.4688078703703704], [0.4500689655172414, 0.4677083333333333], [0.4486896551724138, 0.4648148148148148], [0.4442758620689655, 0.4607638888888889], [0.4420689655172414, 0.4592013888888889], [0.4375172413793104, 0.4567708333333333], [0.4362068965517241, 0.4556712962962963], [0.4313103448275862, 0.4516203703703704], [0.4289655172413793, 0.4466435185185185], [0.4257241379310345, 0.4429976851851852], [0.4198620689655173, 0.4391782407407407], [0.4149655172413793, 0.4360532407407408], [0.4093103448275862, 0.4341435185185185], [0.4002758620689655, 0.4305555555555556], [0.3935862068965517, 0.4264467592592592], [0.3826896551724138, 0.4217013888888889], [0.3767586206896552, 0.4188078703703704], [0.3679310344827586, 0.4165509259259259], [0.3608275862068965, 0.4145833333333334], [0.3474482758620689, 0.4121527777777778], [0.3393103448275862, 0.4111111111111111], [0.3349655172413793, 0.4133680555555556], [0.3308275862068966, 0.4192708333333333], [0.3296551724137931, 0.4217013888888889], [0.3302068965517241, 0.425], [0.330896551724138, 0.4265625], [0.3336551724137931, 0.428125], [0.334, 0.4298032407407407], [0.3337931034482758, 0.4329282407407408], [0.333448275862069, 0.4350694444444445], [0.3323448275862069, 0.4368634259259259], [0.3293103448275862, 0.4397569444444445], [0.3273793103448276, 0.4412037037037037], [0.3264827586206897, 0.4433449074074074], [0.3284827586206897, 0.4466435185185185], [0.3268275862068966, 0.4514467592592593], [0.3242068965517241, 0.4558449074074074], [0.3248275862068966, 0.4585648148148148], [0.3253793103448276, 0.4604166666666666], [0.3230344827586207, 0.462962962962963], [0.3217241379310345, 0.4684606481481481], [0.3216551724137931, 0.4730324074074074], [0.3224827586206896, 0.4777777777777778], [0.3237241379310345, 0.4815972222222222], [0.326551724137931, 0.4857638888888889], [0.3293103448275862, 0.4884259259259259], [0.3313793103448276, 0.4902777777777778], [0.3327586206896552, 0.4946180555555555], [0.3317241379310345, 0.4998263888888889], [0.3299310344827586, 0.5050925925925925], [0.3284827586206897, 0.5101851851851852], [0.326551724137931, 0.512962962962963], [0.3263448275862069, 0.5190393518518519], [0.3257931034482759, 0.5231481481481481], [0.3231034482758621, 0.5277777777777778], [0.3231034482758621, 0.53125], [0.3228965517241379, 0.5361689814814815], [0.3240689655172414, 0.5380787037037037], [0.3280689655172414, 0.5397569444444444], [0.330551724137931, 0.541724537037037], [0.3320689655172414, 0.5431134259259259], [0.3333103448275862, 0.5471064814814814], [0.333448275862069, 0.5524305555555555], [0.3324827586206897, 0.5564814814814815], [0.3306206896551724, 0.5615740740740741], [0.3286206896551724, 0.5670138888888889], [0.3271724137931035, 0.571412037037037], [0.327448275862069, 0.5751157407407408], [0.3293103448275862, 0.5788194444444444], [0.3304137931034483, 0.5825231481481481], [0.3331034482758621, 0.5887152777777778], [0.3343448275862069, 0.5942708333333333], [0.335448275862069, 0.5998842592592593], [0.3386896551724138, 0.6079861111111111], [0.3401379310344828, 0.6134259259259259], [0.3393793103448276, 0.6184606481481482], [0.3380689655172414, 0.6251736111111111], [0.3381379310344828, 0.6298611111111111], [0.3417931034482758, 0.6332175925925926], [0.3433103448275862, 0.6409722222222223], [0.3452413793103448, 0.6448495370370371], [0.3517931034482759, 0.6532407407407408], [0.3546896551724138, 0.657349537037037], [0.3573103448275862, 0.6623263888888888], [0.3601379310344828, 0.6679398148148148], [0.3613793103448276, 0.6710069444444444], [0.3626896551724138, 0.672511574074074], [0.3628965517241379, 0.6753472222222222], [0.3636551724137931, 0.6774305555555555], [0.3662068965517241, 0.6799768518518519], [0.3718620689655173, 0.6814814814814815], [0.3782068965517241, 0.6840277777777778], [0.3868965517241379, 0.6858796296296297], [0.3957241379310345, 0.6872685185185186], [0.4028965517241379, 0.6886574074074074], [0.4155862068965517, 0.6893518518518519], [0.427448275862069, 0.6918981481481481], [0.4336551724137931, 0.6918981481481481], [0.4401379310344827, 0.6925925925925925], [0.4437241379310345, 0.6920138888888889], [0.4480689655172414, 0.6921006944444444], [0.4442758620689655, 0.6883391203703704], [0.4407931034482759, 0.6866898148148148], [0.4416896551724138, 0.6852141203703703], [0.4421034482758621, 0.684230324074074], [0.4411379310344827, 0.6835358796296296], [0.4414137931034482, 0.6827835648148148], [0.4418275862068965, 0.6820023148148148], [0.4465172413793104, 0.6798032407407407], [0.4466206896551724, 0.67890625], [0.4473103448275862, 0.6783275462962963], [0.4485172413793104, 0.6784722222222223], [0.4482413793103448, 0.6794849537037037], [0.4493448275862069, 0.6795428240740741], [0.450448275862069, 0.6789641203703703], [0.4518275862068966, 0.6789930555555556], [0.4521034482758621, 0.6796006944444445], [0.4542068965517241, 0.6799479166666667], [0.4554827586206897, 0.6804108796296297], [0.4577931034482758, 0.6813657407407407], [0.4600689655172414, 0.6814236111111112], [0.4621379310344828, 0.6811342592592593], [0.4646206896551724, 0.6826388888888889], [0.4665517241379311, 0.6854166666666667], [0.4698620689655172, 0.6900462962962963], [0.4713793103448276, 0.6907407407407408], [0.474, 0.6945023148148148], [0.4774482758620689, 0.6961805555555556], [0.4784137931034483, 0.6965277777777777], [0.4790344827586207, 0.6946180555555556], [0.4812413793103448, 0.6949074074074074], [0.4826206896551724, 0.6956597222222223], [0.4833793103448276, 0.6960069444444444], [0.4844827586206897, 0.694675925925926], [0.4846896551724138, 0.692650462962963], [0.4832413793103448, 0.6890046296296296], [0.4806896551724138, 0.6857060185185185], [0.4788965517241379, 0.6831597222222222], [0.4753793103448276, 0.6804976851851852], [0.4725517241379311, 0.6784143518518518], [0.4700689655172414, 0.6755208333333333], [0.4700172413793103, 0.6749855324074074], [0.4684655172413793, 0.6732060185185185], [0.4671551724137931, 0.6730324074074074], [0.4659482758620689, 0.6717737268518519], [0.4652413793103448, 0.6696180555555555], [0.4646206896551724, 0.6668402777777778], [0.4643448275862069, 0.6640046296296296], [0.4646206896551724, 0.6628472222222223], [0.4632413793103448, 0.6618055555555555], [0.4632413793103448, 0.6601851851851852], [0.4644827586206897, 0.6590277777777778], [0.4658620689655172, 0.6574074074074074], [0.4680689655172414, 0.6568287037037037], [0.4702068965517242, 0.6581597222222222], [0.4733103448275862, 0.6583333333333333], [0.4755862068965517, 0.6597222222222222], [0.4767586206896552, 0.6615740740740741], [0.4777931034482759, 0.6640625], [0.4788965517241379, 0.6652777777777777], [0.4782068965517242, 0.6671875], [0.4802758620689655, 0.6686921296296297], [0.4815172413793103, 0.6706018518518518], [0.484, 0.6711226851851851], [0.4864137931034483, 0.6715277777777777], [0.4880689655172414, 0.6715277777777777], [0.4897931034482759, 0.6716435185185186], [0.4922068965517241, 0.6742476851851852], [0.4943448275862069, 0.6764467592592592], [0.4957931034482759, 0.6775462962962963], [0.4973793103448276, 0.6775462962962963], [0.4991034482758621, 0.6760995370370371], [0.5004827586206897, 0.674537037037037], [0.5015172413793103, 0.6729166666666667], [0.5007586206896552, 0.6716435185185186], [0.5015172413793103, 0.6703703703703704], [0.5029655172413793, 0.6698495370370371], [0.5042758620689655, 0.6700231481481481], [0.5084137931034483, 0.6660879629629629], [0.5101379310344828, 0.6655092592592593], [0.5121379310344828, 0.6655092592592593], [0.5135172413793103, 0.6653356481481482], [0.5146896551724138, 0.6653356481481482], [0.5160689655172414, 0.6660879629629629], [0.5171724137931034, 0.666724537037037], [0.5257931034482759, 0.6677662037037037], [0.5291034482758621, 0.665162037037037], [0.5295172413793103, 0.6634837962962963], [0.5311034482758621, 0.6632523148148148], [0.5325172413793103, 0.6637731481481481], [0.5327241379310345, 0.6659722222222222], [0.5329310344827586, 0.672337962962963], [0.5334827586206896, 0.6732638888888889], [0.5355172413793103, 0.6734375], [0.5366896551724137, 0.6733796296296296], [0.5376551724137931, 0.6724247685185185], [0.5377241379310345, 0.6691550925925925], [0.5370344827586206, 0.6657407407407407], [0.5358620689655172, 0.6644675925925926], [0.5344137931034483, 0.6633680555555556], [0.5343103448275862, 0.6622395833333333], [0.5345172413793103, 0.6606770833333333], [0.535448275862069, 0.6577546296296296], [0.5345517241379311, 0.6562789351851852], [0.5348275862068965, 0.6548321759259259], [0.5353448275862069, 0.6544849537037037], [0.5351724137931034, 0.6516203703703703], [0.5358275862068965, 0.649537037037037], [0.5391724137931034, 0.6464699074074074], [0.5422758620689655, 0.6445023148148148], [0.545448275862069, 0.6435763888888889], [0.5464137931034483, 0.6420138888888889], [0.5477931034482758, 0.6416666666666667], [0.5486206896551724, 0.6398726851851851], [0.5495172413793104, 0.6391203703703704], [0.5527586206896552, 0.633275462962963], [0.5542758620689655, 0.6271412037037037], [0.5551034482758621, 0.6214699074074074], [0.5546896551724138, 0.6092013888888889], [0.555448275862069, 0.6072337962962963], [0.5615862068965517, 0.6008101851851851], [0.5615862068965517, 0.5995370370370371], [0.5599310344827586, 0.5983796296296297], [0.5608275862068965, 0.596875], [0.5607586206896552, 0.5927662037037037], [0.5601379310344827, 0.591087962962963], [0.5580689655172414, 0.590625], [0.5568965517241379, 0.5890625], [0.5577931034482758, 0.5861689814814814], [0.5584137931034483, 0.5850694444444444], [0.5628965517241379, 0.5824652777777778], [0.564, 0.5798611111111112], [0.5635172413793104, 0.5778356481481481], [0.5627586206896552, 0.5756365740740741], [0.5588275862068965, 0.5706597222222223], [0.5583448275862068, 0.5664930555555555], [0.5601379310344827, 0.5642939814814815], [0.5619310344827586, 0.5630787037037037], [0.5633103448275862, 0.5611111111111111], [0.562, 0.5576967592592592], [0.5601379310344827, 0.5549768518518519], [0.5573793103448276, 0.5527777777777778], [0.5535172413793104, 0.549537037037037], [0.5508275862068965, 0.5491319444444445], [0.5502758620689655, 0.5476851851851852], [0.5484827586206896, 0.5431712962962963], [0.5466206896551724, 0.5401041666666667], [0.5451034482758621, 0.5387731481481481], [0.5436551724137931, 0.5355324074074074], [0.5438620689655173, 0.5329861111111112], [0.5448275862068965, 0.530787037037037], [0.546896551724138, 0.5292824074074074], [0.5462758620689655, 0.5277199074074074], [0.5440689655172414, 0.5261574074074075], [0.5400689655172414, 0.5254629629629629], [0.5369655172413793, 0.5215277777777778], [0.5333793103448276, 0.5177083333333333], [0.5293103448275862, 0.5103009259259259], [0.5263448275862069, 0.5081018518518519], [0.5257758620689655, 0.5086082175925926], [0.5255172413793103, 0.5100983796296297], [0.5245862068965518, 0.5114438657407407], [0.5225689655172414, 0.5109519675925925], [0.5208103448275863, 0.5096932870370371], [0.5208275862068965, 0.5056712962962963], [0.5223448275862069, 0.5038194444444445], [0.523448275862069, 0.5035879629629629], [0.5226206896551724, 0.4991898148148148]]]
cbf00301-c56a-4702-92b7-c5fa6013f99a	Duchés des Dolomite	150000	Histoire :\nNation majoritairement Gnome elle a vassalisée le royaume de l’Antre après que les grands dragons chromatiques se soient retirés des affaires des mortels.\nLe Grand blocus maritime de l’an 1006 à fait céder l’Antre.\nTrès connue pour leurs école de magie chaque ville c’est spécifié dans une école particulière.\nEconomie :\nComment le système économique fonctionne ?\nBeaucoup de manufacture mixant ingénierie/magie ils exportent aussi beaucoup de matière première magique avec les cité libre et le sultanat de Sandarane.\nQuelles sont les ressources les plus précieuses ?\nLe Fer-dragon runique, cuire de dragon runique (très rare et illégale braconnage de Sangdragon)\nComment les ressources sont vendues ?\nEn contrat exclusif avec la C.C.C.H pour la partie illégale un cartel gère une partie des marchés noir avec la C.C.C.H\nQuelles sont les régions les plus riches ?\n\tLe Nord avec son commerce avec les cités libres.\nReligion :\ndieux/déesses des religions du monde ?\nAzouth et Gond est assez prié\nMyths and Legends ?\n\t-\nPrincipaux idéal ou principes ?\n\tla connaissance et la créativité \nPossible tentions entre les religions ? guerre ?\n\tNone\n\nMagie :\nChaque ville à école de magie spécialisé dans une école\nCalteri : Évocation\nArrezo : Transmutation\nVolturo : Abjuration\nRussolio : Invocation\nStiffe : Divination\nRaino : Illusion\nIserna  : Enchantement\nExecutive :\nSystème des gouvernements ? \nUn conseil des mages : Magisterium\nQui à le pouvoir ? et comment il s’échange ?\nLe conseil des mages est créé par chaque ville qui envoie un et le conseille élit le Roi Archimage pour 20 prochaine années. \nComment les lois sont gérées ?\nPar vote unanime ou à la majorité. \nQui gère l'application de la loi ? \n\tmaître de l’école de magie (le représentant au conseil)\nLe maire des villes, les chevaliers et miliciens.\nTopologie : \nZone géographique remarquable ?\nLa forêt d’argent.\nLe Lac Vert (au sud de la capital)\nComment les ressources naturelles sont-elles disponibles ?\n\tDes essences de bois rare, beaucoups de culture de fruits et légumes\nComment la géolocalisation influe-t-elle sur la survie des cultures ? \n\tUne culture basé sur beaucoups de commerce avec les cités libres et un peu avec le sultanat\nInhabitant :\nCombien de races intelligentes vivent dans le monde ? Comment interagissent- elles entre elles ?\nToutes mais peu de Sangdragon car mal vu après la vassalisation.\nCulture :\nQuelle est la fonctionnalité ou différence entre les cultures ?\n\tUn peuple en général assez réservé \nChef d'œuvre dans l’arts / littérature / architecture  ?\n\tLe sanctuaire au dragon taillé à même dans la montagne \nQuel conflit il y a dans votre société ?  de gros conflits  ? récurrent ?\n\tPas mal de tension entre Drakonien/Gnome \nQuels effets ces conflits ont sur le monde ?\n\tBeaucoups de rixe/raquette ciblé en les 2 races \nSociété :\nQuelles sont les races les plus importantes  ?\nLes Gnome.\nQui sont les moins ?\nLes Drakonien.\nComment elle coexiste ensemble ?\nMal tension entre Drakonien/Gnome	0101-11-26 23:50:39	#631ce9	f	/flag/Les_Duchés_Des_Dolomite.png	[[[0.4187586206896552, 0.3027777777777778], [0.4016551724137931, 0.299537037037037], [0.3922758620689655, 0.2939814814814815], [0.3812413793103449, 0.2953703703703704], [0.3652413793103448, 0.2953703703703704], [0.353103448275862, 0.2902777777777778], [0.3420689655172414, 0.2888888888888889], [0.3304827586206897, 0.2939814814814815], [0.319448275862069, 0.2967592592592593], [0.3026206896551724, 0.2905092592592592], [0.2957931034482759, 0.2750578703703704], [0.3095172413793104, 0.2523148148148148], [0.3019310344827586, 0.2489583333333333], [0.3026206896551724, 0.2449074074074074], [0.3113103448275862, 0.2431712962962963], [0.3153103448275862, 0.2328703703703704], [0.3238620689655172, 0.2222222222222222], [0.3343448275862069, 0.2087962962962963], [0.3492413793103448, 0.1875], [0.3591724137931034, 0.175462962962963], [0.368551724137931, 0.1703703703703704], [0.3768275862068965, 0.1652777777777778], [0.383448275862069, 0.1574074074074074], [0.3937931034482758, 0.1447916666666667], [0.4067586206896552, 0.1350694444444444], [0.4215172413793103, 0.1324074074074074], [0.4347586206896552, 0.1263888888888889], [0.4391724137931035, 0.1171296296296296], [0.4408275862068965, 0.1046296296296296], [0.4496551724137931, 0.1], [0.4601379310344828, 0.09247685185185185], [0.4761379310344828, 0.0837962962962963], [0.484, 0.08084490740740741], [0.492, 0.08362268518518519], [0.4929655172413793, 0.08732638888888888], [0.4802758620689655, 0.09907407407407408], [0.4717241379310345, 0.1087962962962963], [0.4645517241379311, 0.1166666666666667], [0.4641379310344828, 0.1282407407407407], [0.4577931034482758, 0.1319444444444444], [0.4606896551724138, 0.1393518518518519], [0.4689655172413793, 0.1384259259259259], [0.479448275862069, 0.137962962962963], [0.4866206896551724, 0.1328703703703704], [0.4893793103448276, 0.1268518518518519], [0.4873103448275862, 0.1222222222222222], [0.4889655172413793, 0.1167824074074074], [0.4937931034482759, 0.116087962962963], [0.4986206896551724, 0.1148148148148148], [0.5024827586206897, 0.1116898148148148], [0.5059310344827587, 0.1078703703703704], [0.5126896551724138, 0.1028935185185185], [0.52, 0.1061342592592593], [0.5260689655172414, 0.1082175925925926], [0.5313103448275862, 0.1079861111111111], [0.5339310344827586, 0.1076388888888889], [0.5344827586206896, 0.1116898148148148], [0.5351724137931034, 0.1165509259259259], [0.534896551724138, 0.121875], [0.5343448275862069, 0.1267361111111111], [0.5376551724137931, 0.1297453703703704], [0.542344827586207, 0.1476851851851852], [0.5406896551724137, 0.1611111111111111], [0.5391724137931034, 0.1721064814814815], [0.5364137931034483, 0.1842592592592593], [0.5431724137931034, 0.1930555555555556], [0.542896551724138, 0.2060185185185185], [0.5404137931034483, 0.2203703703703704], [0.5357241379310345, 0.2305555555555556], [0.5371034482758621, 0.2398148148148148], [0.543448275862069, 0.2467592592592593], [0.5533793103448276, 0.2625], [0.5568965517241379, 0.2741319444444444], [0.5572413793103448, 0.2798611111111111], [0.5557931034482758, 0.2819444444444444], [0.5604137931034483, 0.2986111111111111], [0.5641379310344827, 0.3055555555555556], [0.5662068965517242, 0.3100694444444445], [0.530896551724138, 0.3112268518518518], [0.5028965517241379, 0.3084490740740741], [0.4801379310344828, 0.3071759259259259], [0.4510344827586207, 0.305787037037037]]]
929e6be3-224f-4d25-8ea4-8a9d19aa8a02	La Reinaume de la mère de pierre	150000	La Reinaume de la mère de pierre	0191-05-31 23:50:39	#e99d1c	f	/flag/Le_Reinaume_De_La_Mère_De_Pierre.png	[[[0.4791724137931034, 0.903587962962963], [0.4667586206896552, 0.8930555555555556], [0.456551724137931, 0.8854166666666666], [0.448, 0.8836805555555556], [0.4416551724137931, 0.8790509259259259], [0.4364137931034483, 0.8774305555555556], [0.4343448275862069, 0.8724537037037037], [0.4248275862068965, 0.8644675925925925], [0.4216551724137931, 0.8575231481481481], [0.4124137931034483, 0.8518518518518519], [0.4089655172413793, 0.8475694444444445], [0.4085517241379311, 0.8388888888888889], [0.4049655172413793, 0.8361111111111111], [0.4031724137931034, 0.830324074074074], [0.4020689655172414, 0.8280092592592593], [0.4048275862068966, 0.8180555555555555], [0.4052413793103448, 0.8128472222222223], [0.4048275862068966, 0.8074074074074075], [0.4027586206896552, 0.8045138888888889], [0.4044137931034483, 0.7974537037037037], [0.4092413793103448, 0.7873842592592593], [0.4146206896551724, 0.7827546296296296], [0.4169655172413793, 0.7791666666666667], [0.4177931034482759, 0.7732638888888889], [0.419448275862069, 0.7697916666666667], [0.4180689655172414, 0.7623842592592592], [0.4215172413793103, 0.757175925925926], [0.4299310344827586, 0.7543981481481481], [0.4466206896551724, 0.7545138888888889], [0.4568275862068966, 0.752199074074074], [0.4715862068965517, 0.750462962962963], [0.4736551724137931, 0.7466435185185185], [0.4736551724137931, 0.7386574074074074], [0.484551724137931, 0.7180555555555556], [0.4955862068965518, 0.7178240740740741], [0.5057931034482759, 0.7208333333333333], [0.5146206896551724, 0.7247685185185185], [0.5178620689655172, 0.7248842592592593], [0.5191034482758621, 0.7300347222222222], [0.5151724137931034, 0.7397569444444444], [0.5152068965517241, 0.7538194444444445], [0.5144137931034483, 0.7629050925925925], [0.523448275862069, 0.7744212962962963], [0.5282758620689655, 0.7827546296296296], [0.5302068965517241, 0.7871527777777778], [0.5285517241379311, 0.7913194444444445], [0.5255172413793103, 0.7928240740740741], [0.5224827586206896, 0.7984953703703703], [0.5231724137931034, 0.8042824074074074], [0.5275862068965518, 0.8108796296296297], [0.524551724137931, 0.8162037037037037], [0.5100689655172413, 0.8190972222222223], [0.5040689655172413, 0.8240740740740741], [0.5039310344827587, 0.8267939814814815], [0.5043448275862069, 0.828587962962963], [0.5052413793103449, 0.8300925925925926], [0.5086896551724138, 0.8339120370370371], [0.5142068965517241, 0.8384837962962963], [0.5192413793103449, 0.8397569444444445], [0.5240689655172414, 0.8396990740740741], [0.5267586206896552, 0.8428819444444444], [0.5237931034482759, 0.8475694444444445], [0.5215862068965518, 0.8486111111111111], [0.5144827586206897, 0.8511574074074074], [0.5103448275862069, 0.8533564814814815], [0.5066206896551724, 0.8543981481481482], [0.5022068965517241, 0.8572916666666667], [0.4992413793103448, 0.8659722222222223], [0.4991034482758621, 0.8714120370370371], [0.4966206896551724, 0.8795717592592592], [0.4948275862068965, 0.8806712962962963], [0.492551724137931, 0.8804398148148148], [0.4911034482758621, 0.882175925925926], [0.4898620689655173, 0.8918981481481482], [0.4875862068965517, 0.8916666666666667], [0.4861379310344828, 0.8933449074074075], [0.4872413793103448, 0.8951388888888889], [0.487448275862069, 0.8979166666666667], [0.4864827586206897, 0.9009837962962963], [0.4848965517241379, 0.9032986111111111], [0.4827586206896552, 0.9038194444444444]]]
\.


--
-- Data for Name: Lore; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Lore" (id, title, content, "dateInGame", summary, "createdAt", "updatedAt", "isForDM", tags) FROM stdin;
c55f4334-02fb-454f-9b93-57fad6a7efe4	Création de Sandarane	Création de Sandarane	58	Création de Sandarane	2026-03-15 21:27:59.092	2026-03-27 10:06:03.114	f	{Général,Humain,Sandarane}
88717ce3-e7d2-47d1-8966-42b4fc1bbc59	Formation des royaumes contemporains	Formation des royaumes contemporains	100	Formation des royaumes contemporains	2026-03-15 21:29:56.759	2026-03-27 10:08:33.231	f	{Général,Gandorènne,L'Antre,Momoritanie,Sandarane,Dolomites,Alberan,"Mère de Pierre"}
cbea947e-7b90-45ab-ba78-0f4acc31279b	La création des Dragons	La création des Dragons	-5000	La création des Dragons	2026-03-15 21:17:51.185	2026-03-27 09:17:01.783	f	{Général,Dragon}
19e76a65-d101-4636-afa9-0ca012b072e4	L'éveil des dieux	L'éveil des dieux	-99999	L'éveil des dieux	2026-03-15 21:16:48.9	2026-03-27 09:17:21.714	f	{Général,Dieux}
f9677536-d658-4e6e-a905-d0d967b16922	Les dieux lance le grand Cataclysme	Les dieux lance le grand Cataclysme	-3000	Les dieux lance le grand Cataclysme	2026-03-15 21:18:50.423	2026-03-27 09:19:03.747	f	{Général,Dieux}
dbceb186-95f4-4736-a324-855f80505e51	Création des races Elfes	Création des races Elfes	-2500	Création des races Elfes	2026-03-15 21:20:00.905	2026-03-27 09:21:42.584	f	{Général,Dieux,Elfe}
99f4484d-1299-492f-bee5-107fc18aa005	Création des races mortelle	Création des races mortelle	-2000	Création des races mortelle	2026-03-15 21:21:25.85	2026-03-27 09:46:33.195	f	{Général,Dieux,Humain,Nain,Gnome,Orc,Halfelin,Tieffelin,Drakéide}
83b8f3d9-9122-4377-89bc-88be0d0aed05	Apogée de l'age de l'entente	Apogée de l'age de l'entente	-1897	Apogée de l'age de l'entente	2026-03-15 21:22:28.176	2026-03-27 09:47:05.443	f	{Général,Dieux}
d02052b0-81bc-4523-9ee0-ce62bd05e017	La Fracture	La Fracture	-1437	La Fracture	2026-03-15 21:23:09.337	2026-03-27 09:47:31.143	f	{Général,Dieux,Magie}
8a1af23a-077e-4b74-a5ff-b2a1f5b6ee87	L'éternel Crépuscule	L'éternel Crépuscule	-1435	L'éternel Crépuscule	2026-03-15 21:24:24.576	2026-03-27 09:48:28.193	f	{Général,Dieux,Magie}
41bf9b0c-78e5-4e65-b8c6-96b496f96f51	Le grand Sacrifice	Le grand Sacrifice	-11	Le grand Sacrifice	2026-03-15 21:24:57.301	2026-03-27 09:52:54.412	f	{Général,Dieux,Magie}
10a0cb1c-8622-4946-b6e6-106bfffa881f	La longue Nuit	La longue Nuit	-1	La longue Nuit	2026-03-15 21:25:29.355	2026-03-27 09:53:18.344	f	{Général,Dieux,Magie}
c4906c0a-14cf-4c8f-9a69-88b1962ef571	l'Aube : l'ère moderne	l'Aube : l'ère moderne	0	l'Aube : l'ère moderne	2026-03-15 21:26:43.56	2026-03-27 09:53:58.746	f	{Général,Dieux,Magie}
274f300f-1d49-40b9-b280-7c9c0b364283	Schisme et début de la guerre au royaume d'Alberan	Schisme et début de la guerre au royaume d'Alberan	570	Schisme et début de la guerre au royaume d'Alberan	2026-03-15 21:32:02.534	2026-03-27 09:55:29.525	f	{Général,Elfe}
929e572f-4192-408f-93a5-d78ef966b3a9	Bénédiction et émergence de l'empire Momoritanien	Bénédiction et émergence de l'empire Momoritanien	671	Bénédiction et émergence de l'empire Momoritanien	2026-03-15 21:34:54.844	2026-03-27 09:58:08.496	f	{Général,Dieux,Momoritanie}
7bd244e2-0fe6-4491-bb5c-9031acd31ed5	Création du royaume de Gandorènne	Création du royaume de Gandorènne	724	Création du royaume de Gandorènne	2026-03-15 21:36:39.777	2026-03-27 09:59:03.215	f	{Général,Tieffelin,Gandorènne}
0ca28503-a4b0-4e77-9a0f-533956b36700	Déclaration de guerre entre Gandorènne et le saint-empire Momoritanien	Déclaration de guerre entre Gandorènne et le saint-empire Momoritanien	833	Déclaration de guerre entre Gandorènne et le saint-empire Momoritanien	2026-03-15 21:37:56.645	2026-03-27 10:00:32.923	f	{Général,Guerre,Gandorènne,Momoritanie}
8e831065-09ac-4d4a-944b-ceb158436cad	Déclaration de guerre entre L'Antre et les duchés des Dolomites	Déclaration de guerre entre L'Antre et les duchés des Dolomites	846	Déclaration de guerre entre L'Antre et les duchés des Dolomites	2026-03-15 21:39:43.494	2026-03-27 10:01:09.897	f	{Général,Guerre,Dolomites,L'Antre}
4e0250de-ccc9-413f-8261-42bf6dfc1b75	Explosion à Brodnica qui signe la capitulation de l'Antre	Explosion à Brodnica qui signe la capitulation de l'Antre	897	Explosion à Brodnica qui signe la capitulation de l'Antre	2026-03-15 21:43:31.609	2026-03-27 10:02:52.139	f	{Général,Paix,L'Antre,Dolomites}
771bf1fd-c49d-43d1-877e-70f7d19c96cb	Interdiction des mage en Momoritani et création de l'ordre de la Main du Silence	Interdiction des mage en Momoritani.\n\nCréation d'un ordre de paladin qui traque les magiciens clandestin de la brèche.	888	Interdiction des mage en Momoritani et création de l'ordre de la main du silence	2026-05-30 21:13:00.924	2026-05-30 21:15:27.424	f	{Momoritanie}
97fc05f3-5ef1-4bf5-965e-962d98ff629a	Réunion Radius Ignis Mirdobas Filan – Regalio Regani	Réunion secrète : Mirdobas Filan, Radius Ignis (Œil Pourpre), et Regalio. Crypte Rubis, cadence des écailles, canalistes d'aplanissement émotionnel, surveillance quais Arrezo, Braise intercepte transports. Première des Dames Falci demande +100 unités/mois.	907-10-24	Crypte Rubis, écailles, Braise, quais Arrezo.	2026-05-31 14:06:38.973	2026-09-07 09:36:55.829	t	{"Partie 5","Œil Pourpre"}
7289bb59-8ee4-49c6-9106-f12613de3c18	Exécution et enterrement de Zarak Solara	Exécution et enterrement de Zarak Solara. \nLes restes du mage noir on était enterré a différents endroit.	887-09-10	Exécution et enterrement de Zarak Solara	2026-05-30 21:28:03.38	2026-07-28 16:58:40.773	f	{Momoritanie,"Zarak Solara"}
3c18defa-d36d-4ed9-82f6-f53b3f1d0407	Armistice entre Gandorènne et le Saint-empire Momoritanien	Armistice entre Gandorènne et le Saint-empire Momoritanien	848	Armistice entre Gandorènne et le Saint-empire Momoritanien	2026-03-15 21:41:41.86	2026-07-30 10:46:26.349	f	{Général,Paix,Gandorènne,Momoritanie}
90946f23-408d-4720-a2bf-f36958212baf	tentative d'assassinat par Zarak Solara	<p>tentative d'assassinat du roi Izrym par le culte des murmures organisation présidée par Zarak Solara</p>	887-05-07	tentative d'assassinat du roi Izrym par le culte des murmures organisation présidée par Zarak Solara	2026-05-30 21:10:44.675	2026-07-30 10:54:44.999	f	{Momoritanie,"Zarak Solara"}
fac63ba9-4488-4260-9e3f-97984efeba73	Alliance Cilovard–Rigart au port d'Alagir	Lady Velena Cilovard et Eldric Rigart annoncent le partenariat officiel Cilovard–Rigart sur l'estrade du port. Eldric rend hommage à Dorian Rigart. Ordan Tovalis conteste violemment le changement sur les quais. Garde Cilovard disperse la foule ; rumeur d'arrivée du Soleil Pourpre.	907-10-21	Discours de Velena et Eldric ; protestation Ordan Tovalis.	2026-05-31 14:06:38.962	2026-05-31 14:12:47.633	t	{"Partie 5",Alagir,Politique}
c7ebd354-f792-41bd-b97c-f5cef512f4b0	Bas-relief « Les Fils de la Pierre » (Arkhal le Premier)	Le Bas-relief – “Les Fils de la Pierre”\nAutour du monolithe d’onyx, un vaste bas-relief cerne la salle.\n Dans la lumière chaude des torches, la pierre pourpre semble respirer.\nOn y voit, tout en bas, les premiers Tovalis jaillissant d’une faille dans la montagne, torches levées, outils en main : “Là où la pierre refuse, la volonté s’insinue.”\n Plus haut, les ouvriers se fondent littéralement à la roche — leurs bras deviennent piliers, leurs visages surgissent des veines de marbre.\n Au centre, Arkhal le Premier, couronné d’ardoise, brandit un marteau runique planté dans la roche : “Par la main qui frappe, la pierre se souvient.”\n Autour de lui, douze figures agenouillées pèsent des blocs identiques sur une balance : symbole de la justice clanique.\n Enfin, au sommet, des enfants lèvent leurs outils vers la lumière filtrant d’une fissure, tandis que les anciens les entourent d’une arche protectrice.\nLa frise se referme sur une phrase runique :\n“Nous ne bâtissons pas des murs — nous bâtissons des serments.”\nSous la flamme vacillante, les veines rouges du marbre semblent palpiter comme un cœur ancien.\n\nDerrière 2 immenses escaliers en colimaçon somptueux dans leur décoration s'enfoncent vers l’étage inférieur.\n	\N	Frise historique Tovalis au Palazzo.	2026-05-31 14:08:00.852	2026-05-31 18:45:06.766	t	{"Partie 5",Tovalis,Histoire}
91150c7e-754d-464c-bb1e-da7c51190e85	Création du culte des Murmures	<p>Création du culte des Murmures : Zarak créer en secret un culte pour déstabilisé le royaume Sebqua déjà meurtrie par la guerre avec Gandorenne </p>	883-03-06	Création du culte des Murmures 	2026-07-30 10:52:56.514	2026-07-30 10:53:28.182	f	{"Zarak Solara",Momoritanie}
def7f141-61de-474f-8fe8-43b69603e734	L'archimage Zarak Solara découvre un artéfact dans les profondeur de Kalanos	<p>L'archimage Zarak Solara du royaume de Sebqua découvre un artéfact lors de la première exploration <strong>Des Abysses Murmurants </strong>ville en ruine sous Kalanos. La langue des profondeur, qui viendrai de <strong>Garcis le noir</strong> démon la peur. Il cacha ça découverte 4 ans.</p>	880-03-12	L'archimage Zarak Solara découvre un artéfact dans les profondeur de Kalanos	2026-07-28 16:37:25.897	2026-07-30 10:47:31.904	f	{Momoritanie,"Zarak Solara"}
\.


--
-- Data for Name: LoreCity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LoreCity" (id, "loreId", "cityId") FROM stdin;
f0fa934b-c57d-4e37-90dd-ce323b3da0ae	fac63ba9-4488-4260-9e3f-97984efeba73	6d39b2bc-6488-4763-9643-b57e9af59c03
8aa07549-d22f-409d-9af6-eb7237bf39d1	97fc05f3-5ef1-4bf5-965e-962d98ff629a	6d39b2bc-6488-4763-9643-b57e9af59c03
951c0c7a-080f-4a27-8662-c828fe0ab9af	c7ebd354-f792-41bd-b97c-f5cef512f4b0	6d39b2bc-6488-4763-9643-b57e9af59c03
\.


--
-- Data for Name: LoreKingdom; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LoreKingdom" (id, "loreId", "kingdomId") FROM stdin;
\.


--
-- Data for Name: LoreOrganisation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LoreOrganisation" (id, "loreId", "organisationId") FROM stdin;
7e13c276-8d00-430f-a72b-0bc4de4ac7e4	fac63ba9-4488-4260-9e3f-97984efeba73	17ddb3d6-ad88-49dd-9760-c0aa8583d177
1ffc5ad1-b894-4829-942a-983fc7849968	fac63ba9-4488-4260-9e3f-97984efeba73	9ee70a4b-75b2-45fa-b9f1-2f651a24e194
5872cb9a-f8c2-4210-91f4-b7820ae4db6e	fac63ba9-4488-4260-9e3f-97984efeba73	e6a42128-6fb4-4dea-bd11-2e34be47c513
ea317421-edfa-485b-8a8d-256c53d286bb	97fc05f3-5ef1-4bf5-965e-962d98ff629a	26e34441-4c27-4be0-948c-342e42221c41
9612b118-1e69-4839-915a-10dc7464f3bf	97fc05f3-5ef1-4bf5-965e-962d98ff629a	19bc865c-5575-4446-8836-bf7b78ac00a3
37ea07c3-c4cc-467d-abc1-5b9316375923	c7ebd354-f792-41bd-b97c-f5cef512f4b0	e6a42128-6fb4-4dea-bd11-2e34be47c513
\.


--
-- Data for Name: LorePerson; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LorePerson" (id, "loreId", "personId") FROM stdin;
b372e660-8fa7-420e-b48b-80c07c4aecce	fac63ba9-4488-4260-9e3f-97984efeba73	f77d9ba9-30c8-4d94-b0c1-89420f643296
e87a8457-407d-48ea-9687-e04dd8238da2	fac63ba9-4488-4260-9e3f-97984efeba73	148f0452-aa0f-42b1-83a4-23cb30cd0e18
b313660e-9f5b-402b-96b9-e3000dd87ced	fac63ba9-4488-4260-9e3f-97984efeba73	c885e82c-e64e-48e8-8136-5f76d4d4611b
63b0a014-b5b5-43df-b82d-2efce51be179	97fc05f3-5ef1-4bf5-965e-962d98ff629a	3037c0fe-d341-42a8-8eaa-3706786a5ed2
31c0eb43-210b-4b65-a8f0-bdba2c3319ff	97fc05f3-5ef1-4bf5-965e-962d98ff629a	e13c1d51-c23d-470d-a222-38bd035041c0
\.


--
-- Data for Name: LorePlace; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LorePlace" (id, "loreId", "placeId") FROM stdin;
884dc1bf-8318-414d-a148-1bd933e5aec7	97fc05f3-5ef1-4bf5-965e-962d98ff629a	59bfd806-93be-4b93-85ed-e985413ba43b
7f403d79-e0d9-4f9e-9d6a-1bb7e8989f82	97fc05f3-5ef1-4bf5-965e-962d98ff629a	0def10a3-503b-47b2-9ef3-45c42ef5bc28
b94dfe06-46cf-4d58-9ea2-423a63c9ee32	c7ebd354-f792-41bd-b97c-f5cef512f4b0	80349e8d-a048-4ded-9e45-2ed44d91915c
\.


--
-- Data for Name: Organisation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Organisation" (id, name, description, "parentOrganisationId", "organisationType", "isForDM", flag, membership) FROM stdin;
5afa840b-b4d3-4657-bdce-9c75c88d91b6	Le Soleil Pourpre	Force armée officielle d'Alagir, à la fois milice urbaine, armée de garnison et école de mercenaires.\n\nDevise : « La lumière ne juge pas, elle brûle. »\n\nLe Soleil Pourpre maintient l'ordre, protège les carrières, escorte les convois et surveille les institutions bancaires. Aux yeux du peuple, il incarne la discipline, la force et la justice rouge. Ses soldats portent des capes écarlates doublées de cuir noir et marchent au rythme de bottes ferrées. Leur symbole est un disque solaire stylisé divisé en quatre segments, chacun teinté d'un dégradé de pourpre vers l'or.\n\nHiérarchie : Primus Solaris, Radius Ignis, Centurions Pourpres, Solarii et Acolytes Solaires.	\N	PRINCIPAL	f	\N	MILITAIRE
26e34441-4c27-4be0-948c-342e42221c41	L'Œil Pourpre	Structure secrète contrôlant le Soleil Pourpre depuis l'ombre. Le Soleil Pourpre est son bras armé officiel, bien que très peu de personnes connaissent cette vérité. Ses officiers supérieurs reçoivent des éclats de cristal reliés au Tyrannœil, permettant une forme de vision partagée et de contrôle psychique.	\N	PRINCIPAL	t	\N	POLITIC
07619abb-0d8f-4a89-8e1f-8ad76bdcb3a0	La Légion Aveugle	Bataillon secret du Soleil Pourpre composé de soldats rendus volontairement aveugles. Ils perçoivent le monde par l'intermédiaire de la conscience du Roi et du Tyrannœil. Leur existence est niée officiellement.	5afa840b-b4d3-4657-bdce-9c75c88d91b6	CELLULE	t	\N	MILITAIRE
b9ea6c33-b824-432a-9230-8b956b0625da	Syndicat (Alagir)	Type (lore) : criminalite.	\N	PRINCIPAL	f	\N	CRIMINALITE
d9a9ba92-035c-403d-aa42-05720a53fd46	Syndicat (Huriya)	Type (lore) : criminalite.	\N	PRINCIPAL	f	\N	CRIMINALITE
d962acbe-1168-41f7-822a-806ee9b0729a	Le Syndicat d'Alagir	Cellule locale du Syndicat international — voleurs et contrebandiers. Siège : La Place Sombre (port). Dirigé par Faith la Grise. Contrôle la contrebande sur l'Artère Azurée.	\N	CELLULE	f	\N	CRIMINALITE
6429c02f-e1c0-457d-827f-16af1f585c6f	Le Syndicat	organisation de voleur	\N	PRINCIPAL	f	\N	\N
0d14ee13-6fc4-4e95-be91-38cc9e6e5553	Les écailles de Cendre	Un repaire du Syndicat à Huriya\n\nComportement tactique\nLe Syndicat n’engage jamais tous ses effectifs d’un coup\nIls utilisent :\nles escaliers étroits\nles portes verrouillées\nla fumée et l’obscurité\nSi Raskel fuit → la cellule change de planque sous 48h.\n	6429c02f-e1c0-457d-827f-16af1f585c6f	CELLULE	f	\N	\N
dc01bbe3-d1bd-4de5-9295-a58cd5168d3c	La Ligature Bancaire d'Alagir	Cartel légal bancaire coordonné par Lierin Lorial (haut-elfe, prévôt bancaire). Membres : Couronne de Platine, C.C.R.C., Larmes de Ral Zitris, Banque du Dragon d'Or. Harmonise les taux et l'assurance des caravanes.	\N	PRINCIPAL	f	\N	MARCHAND
19bc865c-5575-4446-8836-bf7b78ac00a3	La Braise	Cellule activiste et réseau d'incendiaires liés au Syndicat. Sabotage sélectif pour forcer des renégociations sociales. Dirigée en sous-main par Faith, opérations terrain par Jillian Riverpipe.	\N	CELLULE	f	\N	CRIMINALITE
9ee70a4b-75b2-45fa-b9f1-2f651a24e194	Famille Cilovard	Maison bancaire contrôlant la Couronne de Platine et la Caisse des Richesses Cachées. Symbole : balance dorée asymétrique. Alignement : Loyal Mauvais. Liés malgré eux au Roi-Tyrannœil via un contrat magique.	\N	FAMILLE	f	\N	MARCHAND
ed402865-97fe-4623-a6b0-48d311d5f054	Maison Vanguard	Famille royale régnante d'Alagir. Alignement : Loyal Mauvais (dissimulé). Symbole : vitrail rouge à trois cercles. Siège : Château de Verre. Le Roi Pelfort est en réalité un Tyrannœil polymorphe. Ce qu'il fait creuser sous le Château de Verre — la Crypte Rubis — n'a rien de divin : il veut étendre à la cité entière l'aplanissement émotionnel que ses canalistes expérimentent déjà, et régner sur une population devenue incapable de vouloir autre chose.	\N	FAMILLE	f	\N	POLITIC
72020f98-e744-4fa4-8a60-6ea12e81bb85	Famille Royal Ivelis Huriya	Famille dirigeante : Famille Ivelis\n\nMr Aimon - Mme Sana   \t\t       Mr Volodar \n\t        |\t\t\t\t                   |\nAkkar(M) Ilrune(M) Galya(F)\t\t Keerla(F)\n\n	\N	FAMILLE	f	\N	POLITIC
1ac789f7-01b6-4c67-a1c2-843215557e9e	Famille Tomasio (comtes Dolomites)	Type (lore) : famille.	\N	FAMILLE	f	\N	POLITIC
e6a42128-6fb4-4dea-bd11-2e34be47c513	Famille Tovalis	Maison marchande dominant les carrières de marbre pourpre, guildes de tailleurs, maçons et transporteurs. Devise : "Par le poids et la veine." Siège : Manoir des Trois Carrières. Alignement : Neutre — durs mais justes.	\N	FAMILLE	f	\N	MARCHAND
d43b01df-84ee-4dc8-bc77-d7a566b59dbb	Famille Varek	Famille dirigeante du hameau de Valbrume. Respectée depuis plusieurs générations : sans noblesse, elle possède les meilleures terres du hameau et sert d'intermédiaire entre paysans et autorités momoritaines. Pragmatiques, protecteurs, très attachés aux traditions (médaillon de Tal Alion).	\N	FAMILLE	f	\N	POLITIC
b7689f3e-21a8-4f9c-b2ed-013af9d3d5c3	Famille Solanmir	Lignée elfique d'Elerÿna, remontant à Valdris le Dragon d'or et à Miralyn.	\N	FAMILLE	f	\N	\N
93afc76d-2b39-4e78-a699-a49c0db36b90	La Loutre SAOUL	<p>La maison de <strong>La Loutre SAOUL</strong> — taverne et auberge des Bas-Quais, dans le quartier du Chant de Tal Taris. Entité créée pour porter l'organigramme du personnel de l'établissement.</p>\n<p>Elle verse chaque mois sa « contribution à la tranquillité » à la <strong>Cellule d'Alagir du Conseil d'Acier</strong>, collectée par <strong>Odon Pince</strong>.</p>	4d3a2795-a6b7-4ace-8250-3c24c8a1f78b	PRINCIPAL	f	\N	OTHER
c4566c9c-7412-4548-ae0b-e65351943294	Famille Palhindile	Famille diplomatique dirigeant la Chancellerie d'Alagir. Spécialistes du verre et de la médiation. Symbole : vitrail-colombe fissuré de pourpre. Alignement : Bon Neutre. Perpétuent sans le savoir des rites de verre dont le sens s'est perdu : un serment scellé dans un vitrail lie plus sûrement qu'un contrat, et plus personne chez eux ne sait pourquoi.	\N	FAMILLE	f	\N	POLITIC
f14b3daa-1a98-4175-aa87-ede5f0505c43	La Lentille Brisée	La Cellule huriyeinne du Conseil d'Acier.\n\nLe Conseil d’Acier n’affiche jamais sa présence à Huriya. Ici, il agit par intermédiaires, combats truqués, dettes et silence.\n Le Monocle du Diable sert de point d’ancrage, de lieu de recrutement et de couverture pour les opérations illégales.\nLa cellule n’est pas grande — 9 membres actifs, une vingtaine d’affiliés — mais extrêmement violente et efficace.	\N	CELLULE	f	\N	CRIMINALITE
d9c8c611-2986-4e8c-856f-465fecbcdf16	Garnison des écus d'or	Le Guet d’Huryia\n\nGardes réguliers\t~140\nArchers\t                ~45\nCavaliers urbains\t~20\nGardes vétérans\t        ~25\nArtisans et soutien\t~30\nOfficiers\t        ~20\n\nDominant les hauteurs fortifiées de la cité d’Huryia, la Garnison des Écus d’Or constitue à la fois le cœur du guet urbain, la principale force militaire de la ville et l’un des symboles les plus visibles de l’autorité momoritaine dans la région.\n\nLes habitants d’Huryia les appellent simplement :\n\n« Les Écus »\n\nVisible depuis presque tous les quartiers grâce à ses hautes tours ivoire et ses bannières dorées flottant au vent, la garnison veille jour et nuit sur :\n\nles portes de la ville,\nles docks,\nles marchés,\nles routes commerciales,\net les quartiers sensibles.\nRôle dans Huryia\n\nContrairement à une simple caserne militaire, les Écus d’Or remplissent plusieurs fonctions essentielles dans la cité.\n\nMaintien de l’ordre\n\nIls assurent :\n\nles patrouilles urbaines,\nles arrestations,\nla gestion des troubles,\net la protection des institutions importantes.\nDéfense de la ville\n\nEn cas de siège ou d’attaque, les Écus deviennent l’armée défensive d’Huryia. Ils coordonnent :\n\nles murailles,\nles tours de défense,\nles barricades urbaines,\net la protection des civils.\nContrôle commercial\n\nLes Écus surveillent :\n\nles taxes,\nles convois marchands,\nles contrebandiers,\net les trafics transitant par le port.\n\nCette responsabilité leur apporte énormément de pouvoir… et de nombreux ennemis.\n\nArchitecture de la Garnison\n\nLa Garnison des Écus d’Or est construite directement contre les remparts intérieurs d’Huryia, non loin du quartier administratif et des grandes artères commerciales.\n\nSon architecture reflète la puissance militaire momoritaine :\n\npierre claire massive,\narches renforcées,\nstatues de chevaliers impériaux,\ntours carrées aux toits d’ardoise sombre,\ncours intérieures pavées.\nLa Cour des Écus\n\nImmense cour centrale utilisée pour :\n\nles entraînements,\nles rassemblements militaires,\nles annonces publiques,\net les exécutions officielles.\n\nLe sol y est marqué par des décennies de combats d’entraînement.\n\nLes Tours des Veilleurs\n\nCes tours servent aux archers et observateurs chargés de surveiller :\n\nles murailles,\nles quartiers marchands,\nles docks,\net les routes approchant Huryia.\n\nLa nuit, leurs feux servent également de système d’alerte.\n\nLa Forge des Serments\n\nGrande forge militaire entretenue jour et nuit.\nLes armes et armures du guet y sont :\nréparées,\nentretenues,\net parfois enchantées.\nLes Profondeurs\n\nLe réseau de cellules souterraines de la garnison.\nOn y enferme :\n\ncriminels,\nespions,\ncontrebandiers,\net parfois prisonniers politiques.\n\nCertaines rumeurs évoquent :\n\ndes salles d’interrogatoire secrètes,\ndes tunnels oubliés,\net des détenus jamais revus.\nLe Bastion Central\n\nCentre administratif et stratégique de la garnison :\n\nsalle de commandement,\narchives,\ncartes militaires,\narmurerie d’officiers,\nappartements du haut commandement.\nEffectifs\n\nLa Garnison des Écus d’Or est l’une des plus importantes forces armées urbaines de la région.\n\nRéputation dans la ville :\nLes habitants d’Huryia entretiennent une relation complexe avec les Écus d’Or.\n\nLes marchands disent :\n« Sans eux, les routes seraient pleines de brigands. »\n\nLes pauvres murmurent :\n« Ils protègent surtout ceux qui ont de l’or. »\n\nLes criminels savent :\n« Les Écus ne dorment jamais… mais certains ferment les yeux pour le bon prix. »\n\nHaut Commandement :\n\n\nSir Aldric de Valbourg\nMaître des Écus\nCommandant suprême du guet d’Huryia.\n\nVétéran respecté et figure d’autorité majeure de la ville, Aldric dirige les Écus avec une discipline inflexible.\n\nIl croit sincèrement que :\n« L’ordre vaut tous les sacrifices. »\n\nSous son commandement, la garnison est devenue plus efficace… mais aussi plus dure.\n\nOfficiellement incorruptible, Aldric tolère pourtant certaines opérations illégales discrètes lorsqu’elles servent les intérêts de la ville ou garantissent la stabilité du guet.\n\nDame Elara Brumetaille\nProtectrice des Écus\nConseillère politique et stratégique du commandement.\n\nElara agit rarement de manière directe. Elle préfère :\nles négociations,\nles manipulations politiques,\nles réseaux d’information,\net les accords silencieux.\nBeaucoup la pensent plus dangereuse qu’Aldric lui-même.\n\nSir Gadwain Brise-fer\nGardien de l’Honneur\nCapitaine principal de la garde urbaine.\n\nImmense vétéran au tempérament rude mais juste, Gadwain est profondément respecté par les soldats.\n\nIl supervise :\nles patrouilles,\nles interventions,\net la discipline militaire.\n\nLady Lyra Astrebois\nArcher d’Élite\nResponsable des archers et de la surveillance longue portée.\n\nFroide et perfectionniste, Lyra dirige les Veilleurs avec une rigueur extrême.\n\nLes meilleurs tireurs d’Huryia passent obligatoirement sous son commandement.\n\nSer Aric Lancelame\nForgeron de la Justice\nMaître d’armes de la garnison.\n\nAncien combattant devenu instructeur et forgeron militaire, Aric supervise :\n\nl’entraînement,\nles duels réglementaires,\net l’entretien des armes.\n\nThane Garek Martel\nGardien Émérite\nSergent-major de la garnison.\n\nPetit mais terriblement autoritaire, Garek maintient l’ordre quotidien parmi les soldats.\n\nIl connaît presque chaque garde par son nom.\n\nSeraphina Lysander\nProtectrice des Écus\nJeune officière ambitieuse et cheffe de peloton.\n\nElle représente la nouvelle génération du guet :\ndisciplinée,\nidéaliste,\net encore convaincue que les Écus peuvent rester honnêtes.\n\nCependant, elle commence à soupçonner certaines corruptions internes.\n\nEadric Forgefeu\nDéfenseur des Écus\nVétéran silencieux servant comme garde d’honneur.\n\nRecouvert d’anciennes brûlures de guerre, Eadric est considéré comme l’un des combattants les plus dangereux de la garnison.\n\nLes jeunes gardes disent souvent :\n\n« Si Forgefeu tire son épée, quelqu’un va mourir. »	\N	PRINCIPAL	f	\N	MILITAIRE
af81ff7a-de0d-418d-93d6-c4d2423b9e14	Cellule du Monocle (Lentille Brisée)	Type (lore) : cellule.\n\nConseil d'Acier.	\N	CELLULE	f	\N	OTHER
df820ea1-9f89-4f92-8782-1fc6a6db13d9	Corps des Médiateurs du Palais des Ententes	Fonctionnaires neutres gérant le Palais des Ententes et facilitant les négociations diplomatiques entre tous les royaumes signataires du Pacte de Huriya. Leur neutralité est sacrée et garantie par le Pacte lui-même.	\N	PRINCIPAL	f	\N	POLITIC
b3dda06f-bfef-414d-a445-cc6d56039d56	Culte de Ral Ibris	Clergé du dieu des contrats, serments et échanges équitables. Particulièrement puissant à Huriya dont il est la principale institution religieuse. Le culte gère la Chambre du Serment et arbitre les litiges contractuels.	\N	PRINCIPAL	f	\N	RELIGEUX
892a08f5-c0d3-49de-be34-e590167ed8fc	Conseil d'Acier	Organisation criminelle majeure opérant dans plusieurs régions de Solenia. Coordonne le Syndicat et les cellules de l'Œil Pourpre.	\N	PRINCIPAL	f	\N	CRIMINALITE
323115d8-36d4-4ca4-8f46-f7b75889d632	C.C.C.H	Chambre de Commerce Clandestine et Honnête. Organisation marchande opérant dans l'ombre à Brodnica et Iserna, avec des connexions dans plusieurs régions.	\N	PRINCIPAL	f	\N	MARCHAND
d154a9d2-ac8d-425b-abc4-79ed9a190e0d	Clan Elurra	Clan drakonien de la neige, l'un des 4 clans majeurs du Dominion de L'Antre. Famille royale du Roi Tonur.	\N	PRINCIPAL	f	\N	POLITIC
96162f28-d7ab-4c13-b838-c4b54b2e10de	Clan Mendia	Clan drakonien de la montagne, l'un des 4 clans majeurs du Dominion de L'Antre.	\N	PRINCIPAL	f	\N	POLITIC
5f0e1e42-8cd9-4e12-a731-736a28fe9817	Clan Itsasoa	Clan drakonien de la mer, l'un des 4 clans majeurs du Dominion de L'Antre.	\N	PRINCIPAL	f	\N	POLITIC
62596e52-6d1e-4e0f-8772-ba83b65b95f7	Clan Gerlaria	Clan drakonien du guerrier, l'un des 4 clans majeurs du Dominion de L'Antre.	\N	PRINCIPAL	f	\N	MILITAIRE
948257f1-7f90-4856-9050-61aa06b52136	Culte de Tiamat	Culte religieux dominant du Dominion de L'Antre vénérant Tiamat le dieu dragon. Espoir d'un jour réveiller Tiamat et unir les dragons.	\N	PRINCIPAL	f	\N	RELIGEUX
5e16f3d1-560f-4740-b471-4a1d506a171c	Magisterium	Conseil des mages gouvernant les Duchés des Dolomite. Composé d'un représentant par ville, élit le Roi Archimage pour 20 ans.	\N	PRINCIPAL	f	\N	POLITIC
9e9d2a12-0dca-4d0a-ad68-c82cc2930e4b	Consortium de l'Ardoise	Organisation marchande de Kalanos contrôlant le commerce de l'ardoise blanche. Dirigé par Hirvel Soran.	\N	PRINCIPAL	f	\N	MARCHAND
d45c5995-0797-4666-8203-e9e839b2c12d	L'Étreinte du Vent	Grande organisation d'assassins fanatiques basée au sud du Sultanat de Sandarane. Siège de l'étreinte du vent.	\N	PRINCIPAL	f	\N	CRIMINALITE
4d3a2795-a6b7-4ace-8250-3c24c8a1f78b	Compagnie des Trois Moustiquaires	Compagnie d'aventuriers propriétaire de La Loutre SAOUL après contrat Sneuk (Partie 5).	\N	CELLULE	f	\N	MARCHAND
62739da4-e5ed-46ef-8345-d0182f80bad3	La Main du Silence	Faction impériale (~25 membres à Valbrume). Officiellement : escorte militaire, protection des routes, maintien de l'ordre. En réalité : renseignement, surveillance politique, élimination discrète. Garnison dans un relais fortifié en pierre. Effectifs types : ~18 soldats, ~4 éclaireurs, ~2 vétérans (voir fiches PNJ clés).	\N	PRINCIPAL	f	\N	OTHER
f7eaae96-549d-4363-8db5-a89a67b285ae	Famille Alym	Famille royale du Sultanat de Sandarane, au pouvoir depuis plus de 400 ans. Pratique le sacrifice du premier jumeau né pour éviter les guerres de succession.	\N	FAMILLE	f	\N	POLITIC
7b11fb97-0c2b-4501-9be6-6caefa22f120	Alliance des Veines	Organisation criminelle de Huriya dirigée par Vessna Kholt, avec Perla Sonne comme assistante.	\N	PRINCIPAL	f	\N	CRIMINALITE
99b36b5f-0dc0-4715-8759-283353dcdec8	Monastère des Nuits	Ordre monastique des montagnes du nord. Huit mages goliath — Une Nuit à Huit Nuits — chacun incarnant une école de la magie arcane. Le monastère veille sur l'équilibre des huit voies ; on n'y entre qu'après une veillée sans lune.	\N	PRINCIPAL	f	\N	RELIGEUX
71566b65-1bff-4651-b4b0-298328c50d64	Compagnie des Voiliers d'Éther	Compagnie de transport fluvial de Huriya dirigée par Tobrin Mullimax. L'un des grands opérateurs logistiques de la cité.	\N	PRINCIPAL	f	\N	MARCHAND
291ad184-e668-4377-ae5e-12163dad8604	Le Fretin	<p>Petite bande de passeurs et contrebandiers opérant depuis les égouts d'Alagir, au niveau de la Porte Basse — repaire dans une alcôve désaffectée accessible par une grille descellée derrière le marché aux bestiaux. Une douzaine de membres à la petite semaine : poudre de marbre, alcool de contrebande, armes non déclarées. « Ni idéologie ni allégeance : juste de l'or et la survie. »</p>\n<p>Depuis peu, ils ont décroché un « gros contrat » qui les dépasse : servir de passeurs à un <strong>fret humain</strong> pour le compte des <strong>Mastiggia</strong> — des esclaves acheminés par les égouts jusqu'à un point de transfert, revendus à une cité vampire souterraine. Le chef, <strong>Sesk Orlo</strong>, y a vu la fortune ; la bande, elle, ne mesure pas dans quoi elle a mis les pieds. C'est ce contrat qui a causé la perte de <strong>Brynn Fer-Vallée</strong>, bouclée pour avoir compris la nature de la cargaison.</p>	\N	CELLULE	f	\N	CRIMINALITE
748c2d82-b991-4526-ba99-1613c0613c4a	Famille Elvaltis	Famille noble du Saint-Empire Momoritanien envoyée gérer Kalanos. Comprend Aedran (gouverneur), Nyssara, Maeltor et Lyris.	\N	FAMILLE	f	\N	POLITIC
989cb484-061f-40ec-928d-cc2225a3eec9	Famille Kinemor	Famille royale du Saint-Empire Momoritanien, siégeant à Momoritania la capitale.	\N	FAMILLE	f	\N	POLITIC
fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	Famille Mastiggia	Aristocratie dolomitcienne, marchands d'âmes et de corps. Comptoir à Alagir (Porte Pourpre). Gesouto Mastiggia — ligne Ezbehar / clan Izotzargi (Partie 5).	\N	FAMILLE	f	\N	MARCHAND
17ddb3d6-ad88-49dd-9760-c0aa8583d177	Famille Rigart	Maison marchande fluviale d'Alagir. Dorian Rigart a bâti les entrepôts des quais ; Eldric poursuit l'ouverture commerciale. Alliance officielle avec les Cilovard (Partie 5) — concurrence avec les Tovalis sur le fleuve.	\N	FAMILLE	f	\N	MARCHAND
92724ba9-f7ec-4a50-941c-0f982090fbff	Syndicat	Réseau criminel opérant dans les cités libres et le Dominion de L'Antre, sous influence du Conseil d'Acier.	\N	CELLULE	f	\N	CRIMINALITE
eb164501-2d6c-45ab-9fa5-447e3f86624b	Œil Pourpre	Organisation criminelle de renseignement et d'espionnage, façade du Soleil Pourpre. Opère des cellules à Iserna et Russolio, sous le Conseil d'Acier.	\N	CELLULE	f	\N	CRIMINALITE
b4c8c6a8-d147-4f42-b12b-74adc397469f	Conseil d'Acier — Cellule d'Alagir	<p>Cellule d'Alagir du <strong>Conseil d'Acier</strong>, organisation criminelle internationale. Siège : le <strong>Bastion Gris</strong>, forteresse souterraine sous la Cinquième Roue, qu'on rejoint par un faux mur des Entrepôts du Pourpre.</p>\n<p>Credo : « <em>La pression forge les forts.</em> » Chaque nuit, les membres frappent trois fois un mur d'acier — « par la pression, la forme et le silence ».</p>\n<p><strong>Trois domaines.</strong> Les <strong>dettes</strong> : le Grand Registre tient les créances des Maisons Cilovard, Tovalis et Palhindile. Les <strong>marchés illégaux</strong> : armes de contrebande sorties du Marteau Courtois, convois nocturnes passant par les Entrepôts du Pourpre. Les <strong>mercenaires</strong> : les « Marteaux », une trentaine d'hommes cantonnés au Hangar du Poids.</p>\n<p><strong>Emprise.</strong> La Cinquième Roue lui appartient de fait, et sa collecte de « contribution à la tranquillité » descend jusqu'aux Bas-Quais — La Loutre SAOUL comprise.</p>\n<p><strong>Rivalités.</strong> Le Syndicat d'Alagir sur les marchés, l'Œil Pourpre sur les convois, et une hostilité froide avec le Soleil Pourpre — dont une partie des Marteaux a été chassée.</p>	892a08f5-c0d3-49de-be34-e590167ed8fc	CELLULE	f	\N	CRIMINALITE
\.


--
-- Data for Name: OrganisationCity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationCity" (id, "organisationId", "cityId") FROM stdin;
3ee47a25-e7d0-4ac7-b121-13061d89f613	0d14ee13-6fc4-4e95-be91-38cc9e6e5553	57171985-dade-4fcc-a00b-c06de058c7d6
59c78115-d784-43e6-9196-3ceff653b023	f14b3daa-1a98-4175-aa87-ede5f0505c43	57171985-dade-4fcc-a00b-c06de058c7d6
99369d5f-a74f-418d-9375-ca572be2fefd	72020f98-e744-4fa4-8a60-6ea12e81bb85	57171985-dade-4fcc-a00b-c06de058c7d6
3c5afed6-02c1-4f03-b358-fd901d99752f	71566b65-1bff-4651-b4b0-298328c50d64	57171985-dade-4fcc-a00b-c06de058c7d6
20b1faa5-5cf1-4f36-bfcf-7bfd4b0e4084	7b11fb97-0c2b-4501-9be6-6caefa22f120	57171985-dade-4fcc-a00b-c06de058c7d6
e939cbe1-c12b-4bbc-b667-396882c4aaf2	d154a9d2-ac8d-425b-abc4-79ed9a190e0d	16e1a8a5-bbef-4927-b769-733a5cc63521
815fede6-2a5d-4b07-9ad4-0942308c63bc	96162f28-d7ab-4c13-b838-c4b54b2e10de	16e1a8a5-bbef-4927-b769-733a5cc63521
eb68b13d-b582-429b-9153-a2df204992fa	5f0e1e42-8cd9-4e12-a731-736a28fe9817	16e1a8a5-bbef-4927-b769-733a5cc63521
0d19a2c7-18e5-4910-b249-1d3caad7568e	62596e52-6d1e-4e0f-8772-ba83b65b95f7	16e1a8a5-bbef-4927-b769-733a5cc63521
769ae972-4bf8-4522-94d4-fbbf7f62af54	748c2d82-b991-4526-ba99-1613c0613c4a	d182b816-ac9f-4f81-afb7-44c7bff6178f
3b5d30a7-3da6-461b-87f1-4a2b15ab439d	9e9d2a12-0dca-4d0a-ad68-c82cc2930e4b	d182b816-ac9f-4f81-afb7-44c7bff6178f
feba98ec-51a2-4e92-bcb3-522d67adb303	989cb484-061f-40ec-928d-cc2225a3eec9	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602
c7f9f92f-ee2f-47ae-b6d7-0bc08330a04d	f7eaae96-549d-4363-8db5-a89a67b285ae	b35688a0-96ed-4416-82b9-19db566f7815
e7ccea45-76d3-4730-8081-172ea7edd3e8	d9c8c611-2986-4e8c-856f-465fecbcdf16	57171985-dade-4fcc-a00b-c06de058c7d6
7f20d647-57db-48e4-a8e5-3841244d5cc3	5afa840b-b4d3-4657-bdce-9c75c88d91b6	6d39b2bc-6488-4763-9643-b57e9af59c03
a2250224-8dca-474f-ad29-03a8a2afd0ae	26e34441-4c27-4be0-948c-342e42221c41	6d39b2bc-6488-4763-9643-b57e9af59c03
976715da-9eb7-47ea-99d1-3366d203ea36	07619abb-0d8f-4a89-8e1f-8ad76bdcb3a0	6d39b2bc-6488-4763-9643-b57e9af59c03
6b2e1217-09f7-4768-8790-426b08dd87ac	df820ea1-9f89-4f92-8782-1fc6a6db13d9	57171985-dade-4fcc-a00b-c06de058c7d6
de06b94c-2a3b-480f-8db2-a463939f5fd2	b3dda06f-bfef-414d-a445-cc6d56039d56	57171985-dade-4fcc-a00b-c06de058c7d6
2ec25e06-0636-4b1f-92b3-32135f4fcf08	ed402865-97fe-4623-a6b0-48d311d5f054	6d39b2bc-6488-4763-9643-b57e9af59c03
d0449237-6fe3-492f-86f5-16183da2225f	e6a42128-6fb4-4dea-bd11-2e34be47c513	6d39b2bc-6488-4763-9643-b57e9af59c03
e1656b94-a9fe-467f-9c90-9e392741fc72	c4566c9c-7412-4548-ae0b-e65351943294	6d39b2bc-6488-4763-9643-b57e9af59c03
953cba06-9ece-45c7-87f4-3caef0b3ee12	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	6d39b2bc-6488-4763-9643-b57e9af59c03
292de683-22fd-4134-a963-6470281ffde2	d962acbe-1168-41f7-822a-806ee9b0729a	6d39b2bc-6488-4763-9643-b57e9af59c03
798729c1-de5e-4455-aa0a-6d9ff17af22c	b4c8c6a8-d147-4f42-b12b-74adc397469f	6d39b2bc-6488-4763-9643-b57e9af59c03
c61a132b-a195-4c16-b60f-40cae5fccb85	dc01bbe3-d1bd-4de5-9295-a58cd5168d3c	6d39b2bc-6488-4763-9643-b57e9af59c03
11bfbadf-0c9b-4613-8989-bd0ef8b579f4	19bc865c-5575-4446-8836-bf7b78ac00a3	6d39b2bc-6488-4763-9643-b57e9af59c03
7ad447e5-13c6-4e9d-9563-3574fcd4e367	17ddb3d6-ad88-49dd-9760-c0aa8583d177	6d39b2bc-6488-4763-9643-b57e9af59c03
131bd825-5a5f-4bc8-b40a-656a49d0f849	4d3a2795-a6b7-4ace-8250-3c24c8a1f78b	6d39b2bc-6488-4763-9643-b57e9af59c03
86a787a3-7f0b-4b9f-9dc9-d57b82c5cc3b	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	6d39b2bc-6488-4763-9643-b57e9af59c03
d86f5248-4b73-40df-99d9-3791d53800ff	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	57171985-dade-4fcc-a00b-c06de058c7d6
c7f32a8b-2314-4ffc-bc1b-09124bf0eb80	291ad184-e668-4377-ae5e-12163dad8604	6d39b2bc-6488-4763-9643-b57e9af59c03
96a911c4-4b35-4b81-9b2a-88918ea087a2	93afc76d-2b39-4e78-a699-a49c0db36b90	6d39b2bc-6488-4763-9643-b57e9af59c03
\.


--
-- Data for Name: OrganisationKingdom; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationKingdom" (id, "organisationId", "kingdomId") FROM stdin;
37cd4f6d-1d9e-41af-a9a1-66ca1dde139f	df820ea1-9f89-4f92-8782-1fc6a6db13d9	0bcb8247-1ea9-48b1-9619-15b5de56ad9c
a4b2e4a8-0eaa-42c3-a045-3cb04fe0bda5	df820ea1-9f89-4f92-8782-1fc6a6db13d9	44383b5f-5ed4-4ae8-91ac-2c377928206e
ab7e1b36-1e03-4b99-be63-bb85484e4cd7	df820ea1-9f89-4f92-8782-1fc6a6db13d9	e44df0a6-ffda-4e97-8f8b-bd34440f07b4
514ce36c-9f98-47bd-9f47-a7af1ff00aca	df820ea1-9f89-4f92-8782-1fc6a6db13d9	4d37eed1-161e-4156-970c-381793c3d614
3efe2eb6-3d9e-462f-8a47-77fbc409c6fd	df820ea1-9f89-4f92-8782-1fc6a6db13d9	6d9412ba-0f6d-41d5-b7b4-13e6549a990d
89a6cd07-8112-4158-acd5-3a3de02b10a1	df820ea1-9f89-4f92-8782-1fc6a6db13d9	cbf00301-c56a-4702-92b7-c5fa6013f99a
fbadfe10-ae9a-4986-ad9f-c3e5638e9912	df820ea1-9f89-4f92-8782-1fc6a6db13d9	929e6be3-224f-4d25-8ea4-8a9d19aa8a02
3609cec4-2cd8-4390-ad54-18fedafbeb82	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	0bcb8247-1ea9-48b1-9619-15b5de56ad9c
2a8c8078-bc9e-4ad0-85f0-003e7fa26117	92724ba9-f7ec-4a50-941c-0f982090fbff	4d37eed1-161e-4156-970c-381793c3d614
d8d87a6e-0d8b-48ba-89e5-4c17c765313b	eb164501-2d6c-45ab-9fa5-447e3f86624b	cbf00301-c56a-4702-92b7-c5fa6013f99a
34fef0ba-8473-4033-a70f-b63549837c8f	892a08f5-c0d3-49de-be34-e590167ed8fc	4d37eed1-161e-4156-970c-381793c3d614
b5e5ff51-8c33-4870-94fe-bdae0572204d	892a08f5-c0d3-49de-be34-e590167ed8fc	cbf00301-c56a-4702-92b7-c5fa6013f99a
9529663f-1b42-43af-b0c5-a02d219ad400	323115d8-36d4-4ca4-8f46-f7b75889d632	4d37eed1-161e-4156-970c-381793c3d614
4cb46258-9c6a-450d-9ac4-d354f46ea31a	323115d8-36d4-4ca4-8f46-f7b75889d632	cbf00301-c56a-4702-92b7-c5fa6013f99a
84d699a7-bb81-4ffc-8a29-40423eb503e6	d154a9d2-ac8d-425b-abc4-79ed9a190e0d	4d37eed1-161e-4156-970c-381793c3d614
4729733d-0ebc-4ffa-8f2f-4b557b0848fa	96162f28-d7ab-4c13-b838-c4b54b2e10de	4d37eed1-161e-4156-970c-381793c3d614
0cb08b57-f036-467f-8ec5-bde6f8fa7912	5f0e1e42-8cd9-4e12-a731-736a28fe9817	4d37eed1-161e-4156-970c-381793c3d614
5ac4f728-0663-49d5-9a8f-957b46125281	62596e52-6d1e-4e0f-8772-ba83b65b95f7	4d37eed1-161e-4156-970c-381793c3d614
4092f05f-7dec-441c-b7a3-832e2a0adb7e	948257f1-7f90-4856-9050-61aa06b52136	4d37eed1-161e-4156-970c-381793c3d614
39e4306c-066e-423e-85fe-1b27355ad206	5e16f3d1-560f-4740-b471-4a1d506a171c	cbf00301-c56a-4702-92b7-c5fa6013f99a
c75e841c-9315-4df7-aef6-5543770ea2f6	748c2d82-b991-4526-ba99-1613c0613c4a	0bcb8247-1ea9-48b1-9619-15b5de56ad9c
a3932116-a857-4dc4-bf66-48d0a609e8d8	9e9d2a12-0dca-4d0a-ad68-c82cc2930e4b	0bcb8247-1ea9-48b1-9619-15b5de56ad9c
911a14ac-a221-4410-88dc-04135efcc776	62739da4-e5ed-46ef-8345-d0182f80bad3	0bcb8247-1ea9-48b1-9619-15b5de56ad9c
144a573c-8683-42ba-bb19-6c6006eccc68	989cb484-061f-40ec-928d-cc2225a3eec9	0bcb8247-1ea9-48b1-9619-15b5de56ad9c
463b3dc0-0496-4279-9793-8b8dab78cfe0	f7eaae96-549d-4363-8db5-a89a67b285ae	6d9412ba-0f6d-41d5-b7b4-13e6549a990d
06faec69-8b55-4059-a0e6-d16874d9a519	d45c5995-0797-4666-8203-e9e839b2c12d	6d9412ba-0f6d-41d5-b7b4-13e6549a990d
\.


--
-- Data for Name: OrganisationMember; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationMember" (id, "organisationId", "personId") FROM stdin;
f6a418ae-794d-4803-8eaf-26bed9c55f61	72020f98-e744-4fa4-8a60-6ea12e81bb85	0635e083-b406-40d7-993a-a29761a51e98
61c3d72f-5c8b-4642-bdf8-ec4ca6e421f7	72020f98-e744-4fa4-8a60-6ea12e81bb85	daf4f14e-23a8-43a4-a8d5-6b8b15f4f5e3
7304ef73-078a-402f-a8d0-12945cdacd5f	72020f98-e744-4fa4-8a60-6ea12e81bb85	8c168c38-e7b9-41c2-8c19-31ab1291a61b
e5c339a5-390e-43c4-b0cd-712f8791a052	17ddb3d6-ad88-49dd-9760-c0aa8583d177	2b1aab71-b65d-4ff1-b3cd-fbb968ed1411
47ca77e2-0b22-4a89-a0df-60e817d20882	72020f98-e744-4fa4-8a60-6ea12e81bb85	fa898d26-72c6-4fa4-958d-5769659f0c96
b9012e7e-03d1-4bf8-a5d0-ad9d92a6adc7	72020f98-e744-4fa4-8a60-6ea12e81bb85	88e30e84-b07b-4b8f-97fe-42f1ab21bd65
51fdd673-bc51-4624-8160-3445a6c8d839	72020f98-e744-4fa4-8a60-6ea12e81bb85	3404bc03-fafd-4973-a52a-7abe5cc45f7b
0af3e92a-ca16-42f4-b260-9705dcd58c97	72020f98-e744-4fa4-8a60-6ea12e81bb85	b4ed8705-c606-4d5c-b2b2-20a02d7f68dd
7c0c4eb6-df86-46c9-a0c8-54130ead681a	b4c8c6a8-d147-4f42-b12b-74adc397469f	c9abd4d1-579f-4006-98d4-f49494a1c1b0
1d3a51af-eb0e-4939-8476-dcdc853b70b3	d9c8c611-2986-4e8c-856f-465fecbcdf16	682aad82-314b-4061-9254-5793ba89e8be
d1c1b68a-91af-404b-8802-f1735d6c278a	d9c8c611-2986-4e8c-856f-465fecbcdf16	8850bce9-a838-461e-b5f7-596394def846
887686d9-ac36-41c0-b5ce-5abcbef32461	d9c8c611-2986-4e8c-856f-465fecbcdf16	558617f8-a75f-41f8-b9d9-0720d71e7754
785f2647-7705-4d21-bd0d-4d94b35e75ed	d9c8c611-2986-4e8c-856f-465fecbcdf16	97d00715-a9d7-4ad3-9506-1e23a2f6e434
7d74f198-670b-49cd-bc8e-71387cec5ae5	d9c8c611-2986-4e8c-856f-465fecbcdf16	16fd6442-836d-4a3d-a3f5-12d9ce6bfe18
8769a0af-e1aa-47f7-b9ff-2119bef0aa86	d9c8c611-2986-4e8c-856f-465fecbcdf16	380d8316-3a6f-40fc-b9f4-5df799f4cf14
24740ff0-56a0-41b4-be97-84c0c0eb7911	d9c8c611-2986-4e8c-856f-465fecbcdf16	9b39a9d2-cbd1-4169-aec1-80c1e5acfa9d
eda4b59b-b59b-4540-9412-52b7c557edca	5afa840b-b4d3-4657-bdce-9c75c88d91b6	e13c1d51-c23d-470d-a222-38bd035041c0
8aa27b8a-8773-40f6-92de-08c6b422a878	26e34441-4c27-4be0-948c-342e42221c41	e13c1d51-c23d-470d-a222-38bd035041c0
8f6ee0b4-1053-4622-9391-7327e43ca5da	5afa840b-b4d3-4657-bdce-9c75c88d91b6	d0556534-e9cd-4984-9336-2bfc2d65330d
82dce49c-eaa5-4b3f-bdbd-f13bcbbf28dc	5afa840b-b4d3-4657-bdce-9c75c88d91b6	3a3880bc-3274-4229-a6e5-08dc14789e11
e21deb29-b5d8-42f4-be32-b6561f4669ec	5afa840b-b4d3-4657-bdce-9c75c88d91b6	8ef5bbf7-606e-4c5d-a427-57698e1072f8
680b9d1a-9608-4107-a8aa-7899d1225943	1ac789f7-01b6-4c67-a1c2-843215557e9e	70ec3e88-19f2-4b45-9f1a-a6cf0e424b82
ff9fe86f-f1da-4d15-b01d-51a0ae78e1b7	5afa840b-b4d3-4657-bdce-9c75c88d91b6	656809e7-16fc-4426-bea1-e959b3b3ca61
d84730a3-3e35-4a09-a679-fa36748816f6	5afa840b-b4d3-4657-bdce-9c75c88d91b6	3619cf19-1247-487a-90e9-809a5f7151cc
989d73ab-dffc-4794-a706-fa2cab46655e	1ac789f7-01b6-4c67-a1c2-843215557e9e	604c2fbb-7b71-4ec7-bcbc-42e12e1739fe
3aeddf9f-6cd0-4920-88ba-56f242801bb1	5afa840b-b4d3-4657-bdce-9c75c88d91b6	f05886e6-dc07-490e-bef6-cfadddc95564
c8629194-941b-4fad-b789-e81385cde39d	5afa840b-b4d3-4657-bdce-9c75c88d91b6	df59f6a7-ad3b-4e8c-b767-2e58b4bdade9
9fcb69a4-df4c-4dc3-83ce-91131002e8cd	5afa840b-b4d3-4657-bdce-9c75c88d91b6	1d1e4325-7323-4b8f-a73c-28a416d31803
9ef880cb-c5e1-4f77-b9b4-c5acf7b7250a	5afa840b-b4d3-4657-bdce-9c75c88d91b6	57723973-8294-4642-ac88-6890c04984a7
b3ffeeeb-2124-4a41-8eed-30753c89eff4	5afa840b-b4d3-4657-bdce-9c75c88d91b6	4168e798-427a-474b-bb0c-cd5b07258f43
e7577280-04d5-4283-a3d6-987ac668b1d0	5afa840b-b4d3-4657-bdce-9c75c88d91b6	7f674dac-162b-4243-8e77-7362d636a241
3f306fb9-d3f2-4483-a60e-b97855b43053	d9c8c611-2986-4e8c-856f-465fecbcdf16	2f92433f-2dcb-4066-b792-27f69e99c84f
d494d69f-92b4-4493-bc85-1c10c7e1dbb6	892a08f5-c0d3-49de-be34-e590167ed8fc	103d4388-fc71-4dad-9b99-186119f693cd
1db5724c-164e-4fe2-8347-17ea03afd2d8	df820ea1-9f89-4f92-8782-1fc6a6db13d9	3b825d8b-5ddf-4e9f-8f6b-6e649330ee05
6e1105c0-791b-4ae8-b820-dff21ab41629	b3dda06f-bfef-414d-a445-cc6d56039d56	ef114e09-ba22-4700-9948-3472f61558f0
87b17c37-a6fd-4128-8653-08f29e9e15d1	ed402865-97fe-4623-a6b0-48d311d5f054	60ee9017-2f5a-45c6-90ae-e7f253db2093
050cda8a-2583-4869-bacd-95cc05bae161	26e34441-4c27-4be0-948c-342e42221c41	60ee9017-2f5a-45c6-90ae-e7f253db2093
9b19361f-992f-466a-9620-036b52d8ded5	ed402865-97fe-4623-a6b0-48d311d5f054	dc878db9-301f-4fbc-b3bb-63298432df54
4437939c-e29d-4bac-bb5d-dde9a166e4ba	5afa840b-b4d3-4657-bdce-9c75c88d91b6	d1e9e544-2b9c-453b-b111-190c32add1cb
410c7dbe-2edf-46dd-a1de-8239875c1bc7	ed402865-97fe-4623-a6b0-48d311d5f054	d1e9e544-2b9c-453b-b111-190c32add1cb
bfe6d4ae-f22a-4e46-a022-157f65458119	dc01bbe3-d1bd-4de5-9295-a58cd5168d3c	216d16e4-dc88-45be-95bf-aa4469195ae3
db22c419-d639-489a-b293-e13224c2ca67	d962acbe-1168-41f7-822a-806ee9b0729a	53f2f592-f1a7-4a7a-8e69-94f1f7e10392
86812ab2-b272-4788-8c51-2896706f724e	19bc865c-5575-4446-8836-bf7b78ac00a3	53f2f592-f1a7-4a7a-8e69-94f1f7e10392
556caac6-baff-4330-8846-788ac8792c88	b4c8c6a8-d147-4f42-b12b-74adc397469f	93239b41-8dee-4147-bc01-c5f2bdfd4614
71514cb3-62b4-45c2-805c-fd0a9ca87ba2	d962acbe-1168-41f7-822a-806ee9b0729a	7633faa3-0a05-46c2-84ef-2af359ecddbd
3cfa5f47-95b7-4086-84c9-d4e5c49087b8	19bc865c-5575-4446-8836-bf7b78ac00a3	7633faa3-0a05-46c2-84ef-2af359ecddbd
7e39af2b-b1ab-4d77-9cfa-8652ce957c71	b4c8c6a8-d147-4f42-b12b-74adc397469f	850749b4-7031-4dcb-8f1b-ab7fffcea695
63660177-a4c5-4c30-8387-3fe62b8ac8bf	d962acbe-1168-41f7-822a-806ee9b0729a	036cc087-0782-4d13-8cf5-f489d0b0839f
b0dc318a-acc3-44f3-9f9b-e74a3a462d4d	d962acbe-1168-41f7-822a-806ee9b0729a	0b636012-fa99-47bc-9147-8b8db7a4f6e9
1264f74f-af43-4baf-8ceb-eeca0ce89823	d962acbe-1168-41f7-822a-806ee9b0729a	6a5b7b66-69da-4d52-ae5c-429c06c4e922
2fface7e-84be-4b2b-b93b-c253fd6b12c6	d962acbe-1168-41f7-822a-806ee9b0729a	2ac16f69-2071-4585-ba34-c47f54e856d9
0c9f70c8-af58-4ef0-a98a-4c1162226a0f	26e34441-4c27-4be0-948c-342e42221c41	11bbab3d-082b-4d21-99bc-2295684d1ee2
73c9f303-19ae-4890-afbf-dd027749f7cf	d962acbe-1168-41f7-822a-806ee9b0729a	08c849e8-8e2c-47e0-a26d-764c484d897d
80000f8c-6126-497a-9345-feba11b54f47	e6a42128-6fb4-4dea-bd11-2e34be47c513	e785fe6c-da97-416c-95a6-4102791b6640
0b09a4bc-30c0-425d-aac0-c2fc063d7821	e6a42128-6fb4-4dea-bd11-2e34be47c513	71a8a898-169f-435b-bf0a-8c3933c60a8d
6ae07e75-db3f-426f-8974-5bc838776a5e	e6a42128-6fb4-4dea-bd11-2e34be47c513	5f7057a8-b5e3-4947-b846-16f62dd43d39
42ac6ccc-36d7-45c8-960d-bb68b2c9d596	d962acbe-1168-41f7-822a-806ee9b0729a	5f7057a8-b5e3-4947-b846-16f62dd43d39
e3c44246-b40b-44fa-88f3-4e4c21150f1f	e6a42128-6fb4-4dea-bd11-2e34be47c513	35c5cd56-05ab-4d10-9489-bf09f3c1d9cc
d6b2e95a-5312-425b-8d0a-1153c48f6d4f	d962acbe-1168-41f7-822a-806ee9b0729a	4b898112-8241-4622-986f-b38d364315ae
4e699a92-65e0-444e-b2b2-5b9ca278c00e	26e34441-4c27-4be0-948c-342e42221c41	4b898112-8241-4622-986f-b38d364315ae
c832e047-7786-4aa8-9ab2-f53dd0745013	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	d8e37ee1-afd3-4901-ba1b-74bc0479acd3
78854719-68e1-454b-ae6f-6392a221ef2b	c4566c9c-7412-4548-ae0b-e65351943294	dbbe28fc-23e4-4d1a-af4c-0e15291ee906
e316b3e1-e589-434e-8920-fe0f52594032	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	56b8619e-f374-44f2-9c1f-38066674cde1
cf40a462-55b7-44e9-b267-806b0eaa6373	17ddb3d6-ad88-49dd-9760-c0aa8583d177	c885e82c-e64e-48e8-8136-5f76d4d4611b
08269d6e-8091-4d22-9b95-09bd248a4069	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	c885e82c-e64e-48e8-8136-5f76d4d4611b
47dea97d-bb4f-466f-bcf6-02fc536bb1fd	17ddb3d6-ad88-49dd-9760-c0aa8583d177	32f901e7-8a07-44df-8854-b00536c41603
3be66586-4cf5-4c2b-8f71-d1a021f614cb	e6a42128-6fb4-4dea-bd11-2e34be47c513	148f0452-aa0f-42b1-83a4-23cb30cd0e18
0221dc17-d5f4-47bc-ae35-93a891395c27	19bc865c-5575-4446-8836-bf7b78ac00a3	abea18f1-9c07-449b-ab79-775016062e80
1cca9c34-0c83-4c76-8295-c5da3b20c045	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	9ef5f994-4e2a-4f0f-b443-cac13adf50db
468a3d71-d110-4bca-b2f1-a0e06f9b0aa0	e6a42128-6fb4-4dea-bd11-2e34be47c513	80891668-5ad8-47a2-ae29-1e6d79be3160
78f43133-7b9f-4ccf-9e0a-823305fee393	26e34441-4c27-4be0-948c-342e42221c41	3037c0fe-d341-42a8-8eaa-3706786a5ed2
79b13c51-0319-4699-a80a-75866f4eb80f	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	fa0063c9-958b-461c-b5ee-42fb880375bc
202b5436-b264-40d3-8a71-1ddade10a994	291ad184-e668-4377-ae5e-12163dad8604	62eb8859-aecc-4577-9674-feae24ddf538
eda405dc-7319-4e67-a983-5f6de2a29500	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	8c2eeaa5-9a2f-4d9f-8fa6-014fa6a70c0b
6bab286e-5f16-449c-898b-d1099ecbea06	b4c8c6a8-d147-4f42-b12b-74adc397469f	776244d3-5c61-4b5e-afd2-3e926aaef5bd
6fb3722f-d057-4b7b-8f7c-da82e5691b82	b4c8c6a8-d147-4f42-b12b-74adc397469f	a84f9bb6-0ea1-4026-968b-6e7738498699
054c7d2f-e5e8-45e3-9f32-3e93a810b2a0	b4c8c6a8-d147-4f42-b12b-74adc397469f	a4710472-7788-4b90-bd60-337c7c035936
4c65e960-090b-46ee-985e-ab20a70b909b	b4c8c6a8-d147-4f42-b12b-74adc397469f	8dfca091-e7fd-492a-9e80-3cb51d173580
a7fe9971-022f-4d4b-973b-c13cac91b77e	93afc76d-2b39-4e78-a699-a49c0db36b90	e4b5e257-5b43-4992-b7da-1e66bb568c22
54592bd4-b3a7-47d6-b177-a3d6d21b7589	93afc76d-2b39-4e78-a699-a49c0db36b90	38b3360c-8a20-408c-ada3-195cbb1fe0eb
2c11437f-14d3-4ae8-9884-ccb4b06e49f7	e6a42128-6fb4-4dea-bd11-2e34be47c513	bcbef7a5-9109-44f2-a960-351ae35476db
af4caef2-0204-4e05-ae5e-22742fa42aec	e6a42128-6fb4-4dea-bd11-2e34be47c513	b9a0b7ee-5455-466d-86c0-12363226b383
7e08f18e-079a-4484-9081-b29c577ab215	e6a42128-6fb4-4dea-bd11-2e34be47c513	d21e951b-fd8b-4c35-9e35-b3cddbbacd47
be6bdc7c-aa65-4089-ac14-f42e8ff3fd69	c4566c9c-7412-4548-ae0b-e65351943294	87d809bb-833e-4fa4-8dff-17e9cd7f3af3
4e1d0615-17e2-449a-8b37-e5e6b7089ee5	c4566c9c-7412-4548-ae0b-e65351943294	381eb3b5-c442-4fce-9388-e6df91d76f56
d1a8b4d1-add1-40a3-bcd3-eea6ce222c33	c4566c9c-7412-4548-ae0b-e65351943294	0622d84c-e5c2-4c64-bac5-74479683daee
158b6040-8537-4ad1-87db-7e2de4829cd5	c4566c9c-7412-4548-ae0b-e65351943294	41fa949e-a4a0-41b8-8c47-a3a6c080879f
f30a7f33-cfef-4f05-8ff0-1ab340f34489	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	67a5fa35-103d-4486-831e-078d56beedc9
2e1da89a-ac5a-459d-ac22-58cbe8246cee	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	f77d9ba9-30c8-4d94-b0c1-89420f643296
6a0783f1-cd32-4ef6-853e-a0163a395577	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	e945a71d-9224-4272-8f9a-c6a775c22110
8ab9fb05-dd24-4915-b168-ed6d28f17a51	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	5e356a69-f3d4-4d03-8046-3f7f89c3512f
e918fd09-8b75-4363-9c6e-f98619440f92	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	52ab9bce-74dd-49b3-85c1-d519c83340f3
a7e5be69-c3bb-4cd7-9856-46703f10dc29	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	8e568e50-446f-4ccf-ad74-ba8fade07a59
f4583474-5b9e-4f23-adbe-ceaee7435e17	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	6951831e-2bb4-40e2-9ecc-bc3cacde1eb4
962c287a-1c7d-40dc-8e86-2275ef148620	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	636aae36-ee4c-4d40-aa22-95409a1f732d
af08c909-57bb-4e11-b89e-2d065a8d7186	62739da4-e5ed-46ef-8345-d0182f80bad3	cea2b827-0f64-4644-b53a-934619178521
68b98595-7676-4438-bd19-9b2f3ea0f670	62739da4-e5ed-46ef-8345-d0182f80bad3	be422053-19d2-4236-bda9-702c8d9432ee
b44446b8-ad0b-4a51-993f-859e5542a31c	62739da4-e5ed-46ef-8345-d0182f80bad3	9a7b6933-5dc5-4e0b-87a1-cf3ac490f268
6545f308-5981-4b9d-a26e-493efb95e2da	62739da4-e5ed-46ef-8345-d0182f80bad3	6770be44-0782-4653-980a-925ff9676607
2fb64e43-6d71-4e52-aee1-c712dfeffd33	62739da4-e5ed-46ef-8345-d0182f80bad3	110efc91-cda4-49e9-8633-f1c68bb51010
05fec797-244d-4f49-9312-ec017e907e92	62739da4-e5ed-46ef-8345-d0182f80bad3	c5b0da05-e204-4613-9e64-cf5aad95f53b
54b07e74-9ac9-476d-954b-dabfe3545589	ed402865-97fe-4623-a6b0-48d311d5f054	99ac533f-31ab-4ef0-a2db-0fe20afbab6f
cd0b3840-50d9-446d-82ef-c32f5d8474af	b4c8c6a8-d147-4f42-b12b-74adc397469f	e4a4f098-636f-4886-9888-e4292ad62361
2ce14f9c-c89c-4e2b-9f27-808f9118df80	93afc76d-2b39-4e78-a699-a49c0db36b90	1e41100b-8f76-40d2-8917-849fb35fa1e3
7b46d68e-fa48-41b8-a53f-2e4b717cf2c7	93afc76d-2b39-4e78-a699-a49c0db36b90	385cd5b3-4dc9-4215-9bc5-56d3f3de8aa7
a845573e-8b6a-4c54-b256-aae099448a70	99b36b5f-0dc0-4715-8759-283353dcdec8	b9fdbf2d-b7cb-4baa-b60b-eaf54dbd8865
4cd86f39-62ee-408a-ae82-a4fcf3541cd1	99b36b5f-0dc0-4715-8759-283353dcdec8	2237610a-899b-4f8b-8c6c-0ad0b7f50fba
ec805be6-2e6c-42c8-bc8a-4433e63e07ef	99b36b5f-0dc0-4715-8759-283353dcdec8	b6d601cd-8b88-4656-a0d3-c8fb6c10808d
0d0b0096-6f54-4465-856e-6cbdb23461cc	99b36b5f-0dc0-4715-8759-283353dcdec8	c73f7e66-4bad-41b9-89ec-f16db2d8ee91
d6549701-a093-45ed-87d8-d3acfd3fc99a	99b36b5f-0dc0-4715-8759-283353dcdec8	b5122e37-4f00-4169-8d83-031c7d3981f5
5058d683-b5ae-49ca-94ac-69d288ef32d8	99b36b5f-0dc0-4715-8759-283353dcdec8	290b1fc7-4fa4-4591-a2e9-bea0cb0e6a5b
45c383f3-352a-42cf-a979-4a639fe1e45f	99b36b5f-0dc0-4715-8759-283353dcdec8	da127a39-9689-4b08-a0c7-8467321f650e
0b8c9573-5f9b-457b-9d81-37a2d770bcd3	19bc865c-5575-4446-8836-bf7b78ac00a3	7a98f51c-2382-4a3c-9972-d28bd933e25c
c2708a7e-37e1-453d-94d7-672f0596af7c	e6a42128-6fb4-4dea-bd11-2e34be47c513	7a98f51c-2382-4a3c-9972-d28bd933e25c
5ca04b2e-c175-4ebd-bfb2-9cc67e24ebe8	e6a42128-6fb4-4dea-bd11-2e34be47c513	bee18153-fe3c-4ffd-8e30-6e91eb31db5e
748fd970-9cd6-45ee-857e-510e474591cc	ed402865-97fe-4623-a6b0-48d311d5f054	54f82a8e-b086-4414-bd1f-489455a0ad8f
61ccd942-358c-4775-b8ae-ff903ac9585a	291ad184-e668-4377-ae5e-12163dad8604	f15655ae-460d-43a7-b970-147cae70e406
68004585-ec8a-49b0-a36c-efc81873737b	e6a42128-6fb4-4dea-bd11-2e34be47c513	f15655ae-460d-43a7-b970-147cae70e406
767f4f46-8d19-4ee2-bd81-d4749db64cac	748c2d82-b991-4526-ba99-1613c0613c4a	662ac8f6-d0cc-41d6-a6fd-90458c351786
2034b176-6b98-49c6-8b98-38194022bc84	748c2d82-b991-4526-ba99-1613c0613c4a	3f56a62c-1102-4826-8c27-bc212a07db29
b22bf43d-f222-4ae6-bf26-aedff8500213	748c2d82-b991-4526-ba99-1613c0613c4a	5caf0606-7c80-4c4b-8560-5dd138500a7d
a151e5c4-5205-44c6-8b72-bc772b436ac0	748c2d82-b991-4526-ba99-1613c0613c4a	fd742210-154f-416b-ac2c-a158d6a35b23
e3a15123-b750-4653-b0c1-727518a7a4cf	99b36b5f-0dc0-4715-8759-283353dcdec8	5292d7d4-ab2e-4ddf-83a0-6aa4f78ce713
\.


--
-- Data for Name: OrganisationPlace; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationPlace" (id, "organisationId", "placeId") FROM stdin;
c26ad2e2-6bb2-4785-836f-4620f7bf2ef3	0d14ee13-6fc4-4e95-be91-38cc9e6e5553	6a3f2770-8383-4464-b840-90386200965c
048b4668-039c-4752-aa30-ef4984709b29	5afa840b-b4d3-4657-bdce-9c75c88d91b6	555b341a-0b2c-4983-8c51-186d9adde148
e4ea2c7c-cc6e-4541-a68f-cbbba0901efe	26e34441-4c27-4be0-948c-342e42221c41	8051841f-52e4-4d8d-91d6-ff4af5ed3070
7ef4ec95-d2c2-46be-890c-bb2ec8b4e6dd	07619abb-0d8f-4a89-8e1f-8ad76bdcb3a0	8051841f-52e4-4d8d-91d6-ff4af5ed3070
bd94a78f-39b7-4e23-acd7-d5f980e65316	5afa840b-b4d3-4657-bdce-9c75c88d91b6	8051841f-52e4-4d8d-91d6-ff4af5ed3070
43ee625b-888b-4fb1-a217-fca9710506b1	26e34441-4c27-4be0-948c-342e42221c41	555b341a-0b2c-4983-8c51-186d9adde148
587bed85-1aea-4712-a455-81f5251865b4	d9c8c611-2986-4e8c-856f-465fecbcdf16	d280b9fb-1b1b-4bcd-9aa0-eaa43700a4fb
9fbdb7d9-112c-411c-8baa-9f764193d115	892a08f5-c0d3-49de-be34-e590167ed8fc	df3fc552-d2a7-4722-b627-367b28740fe5
b34a8185-bf3d-4a6d-a57c-4b05439cfced	df820ea1-9f89-4f92-8782-1fc6a6db13d9	c529b485-e20b-41a9-9954-3058397c3c7d
1ef00f34-cacf-4d98-ac66-b96751d448be	b3dda06f-bfef-414d-a445-cc6d56039d56	de47dbe3-1415-4c22-9559-cb0b280e584c
19bd8781-8d4e-4772-ad98-284f190a6d6b	c4566c9c-7412-4548-ae0b-e65351943294	423c1e1d-80fa-49b5-bc4c-16e3ab7c7254
c6f56b5a-8336-40ec-997e-972a966964cc	e6a42128-6fb4-4dea-bd11-2e34be47c513	c8465912-0c2c-41b2-ad4e-ff3d5216fee1
d48dbfe2-129f-4019-aad4-58e833a1b06f	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	7ba3af96-e3be-4a24-a635-4019fd735b43
9c645d54-415f-40fa-b708-fb47bea183d7	dc01bbe3-d1bd-4de5-9295-a58cd5168d3c	7ba3af96-e3be-4a24-a635-4019fd735b43
dc2904cb-867e-4ab3-9e59-001cd10f5a3c	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	7c5c384e-7ceb-4519-a8ec-306461834613
d9873885-c26e-42ee-9b19-0a81a41f6823	dc01bbe3-d1bd-4de5-9295-a58cd5168d3c	7c5c384e-7ceb-4519-a8ec-306461834613
4dc9a996-e4a7-4c8a-b003-da0b26b7a3b3	e6a42128-6fb4-4dea-bd11-2e34be47c513	2cf8aa39-28d2-4c27-bf2a-a9d5330354f6
98c29bad-d0e9-411d-ad06-78d1022e408a	d962acbe-1168-41f7-822a-806ee9b0729a	06749d5e-ec84-4015-a156-ab1ad1b3a7a4
fb605986-cfe3-49a1-b390-92fe8c39c488	b4c8c6a8-d147-4f42-b12b-74adc397469f	e445a4a2-d1e3-4547-8dd7-4c9faf3e7463
b09485e8-94c5-444e-b3f8-7f9a60605636	c4566c9c-7412-4548-ae0b-e65351943294	b3b0f2aa-5124-4985-bf1f-d07bf3097628
6537dc93-705e-4e75-a21b-81df97908487	c4566c9c-7412-4548-ae0b-e65351943294	0b468ff9-0290-4ea3-ad7a-4c4ba4189bbf
c6950d3c-1a2d-4940-a1fd-a11c752babcd	5afa840b-b4d3-4657-bdce-9c75c88d91b6	756ac544-47ef-4c00-9236-6fe3efd3792e
9ef7dd50-3351-43bd-b120-a9f3fd088a84	e6a42128-6fb4-4dea-bd11-2e34be47c513	c7279c93-060a-4b73-906a-4353b2ce1f15
82ec1f4a-1fd7-47b2-be51-127719ec7100	c4566c9c-7412-4548-ae0b-e65351943294	ad9221dc-540b-401c-a972-ba2b61c8ebe3
90d9c3f7-2f3e-413a-a7bd-a937534dfe06	e6a42128-6fb4-4dea-bd11-2e34be47c513	fd8ed968-cfd3-4d8b-a06f-f65097ae8f5b
3605c8e1-fdf8-48fe-89c9-6ca9ecd7e42c	c4566c9c-7412-4548-ae0b-e65351943294	9ffe2919-51a4-4ec3-92a2-4af55fa1355f
c888ba97-8dbd-4236-a307-517828f0b51e	c4566c9c-7412-4548-ae0b-e65351943294	ac5fdf5d-4195-42a7-8a86-9d8c964336e1
2d72a543-ffa6-4b26-9f1c-8ff826a284b5	c4566c9c-7412-4548-ae0b-e65351943294	199430ce-4977-47bb-9bf8-9a5eb922adad
bd685d2e-28bd-421d-81a0-952b6307ee72	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	b9e6dc77-25ec-44f4-84e6-c34623e647c9
bdce528f-eace-457f-81a5-5a4f87bae4e0	c4566c9c-7412-4548-ae0b-e65351943294	f5b539bf-f8fe-40ec-be80-fae92e62bfeb
765e1ca8-cf67-4a03-b7dc-1bf1d91ec787	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	f5b539bf-f8fe-40ec-be80-fae92e62bfeb
8a7b9830-0e8b-49c0-b42e-ff0e7d5c16c2	d962acbe-1168-41f7-822a-806ee9b0729a	28977457-6c67-47c0-a9eb-385fbe0d15c1
b23704b0-195e-4a3b-b4e2-c6f6d2143fb4	d962acbe-1168-41f7-822a-806ee9b0729a	4001bd74-56fb-4909-82dc-1eef5feeac39
0840a271-d20a-4ea2-84fa-e7907c64a9ab	5afa840b-b4d3-4657-bdce-9c75c88d91b6	4001bd74-56fb-4909-82dc-1eef5feeac39
c5057890-52b1-4b58-9424-241c361ca4e6	d962acbe-1168-41f7-822a-806ee9b0729a	0424792b-e344-42cd-988c-146b68038dfb
318870d2-1cf6-4a1e-be49-c36b381cb6d7	5afa840b-b4d3-4657-bdce-9c75c88d91b6	0424792b-e344-42cd-988c-146b68038dfb
0b5a62fc-2c77-42ef-8f2a-ee5fe85c39b9	d962acbe-1168-41f7-822a-806ee9b0729a	d32f0ae0-88a5-418b-b70f-6e3d56a633e0
0c494a77-c7ff-4777-8ff5-81010c4740b6	d962acbe-1168-41f7-822a-806ee9b0729a	32fcbadb-fcd9-493b-bc91-da51404e1a13
f0345bf3-24e4-41e3-a599-c5eb6f049d6a	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	32fcbadb-fcd9-493b-bc91-da51404e1a13
9c0b589f-cb99-49d5-a73a-30f1235d42c5	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	418977aa-45be-435b-9efe-ab69fed14ac0
c2a7e5ab-4c83-4a1c-9c89-243ca2ede888	d962acbe-1168-41f7-822a-806ee9b0729a	233d4e8f-b373-4a1d-88f0-b3fbb74d2329
7ea5ba72-b60b-4adc-b36c-34523eaa7d0f	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	c9077e67-1cef-4fc0-9395-5cd1e5aaa7eb
09842b50-0db4-4f93-925f-ee5ee6c6dd9b	c4566c9c-7412-4548-ae0b-e65351943294	8f6fe71d-a75c-4235-96da-9b4c65bebe0b
ed63eb52-ed2c-4ecd-bb83-6558452528d6	26e34441-4c27-4be0-948c-342e42221c41	2587a572-d2c8-48ff-8f4b-37e2d8c4f9a6
f118dbdf-ff5c-458e-a833-3ac07d0be225	5afa840b-b4d3-4657-bdce-9c75c88d91b6	1ec106e1-0f0e-4f06-a410-b12f08c2196a
53d5e10e-5ef5-40ad-b904-49478b006b17	26e34441-4c27-4be0-948c-342e42221c41	1ec106e1-0f0e-4f06-a410-b12f08c2196a
43193564-6401-43a2-8e31-2396ab6ca766	ed402865-97fe-4623-a6b0-48d311d5f054	1ec106e1-0f0e-4f06-a410-b12f08c2196a
7fdac830-904a-4af0-bfd0-a77a076ab61a	c4566c9c-7412-4548-ae0b-e65351943294	87c3e055-157a-4dab-b802-05e9219f7327
a44bfd7f-fb22-4dd5-b6d6-c63f2bad45a4	dc01bbe3-d1bd-4de5-9295-a58cd5168d3c	e264e684-1f9f-449f-8174-dafafc097359
59bb665e-00b5-4847-9033-c00f6d052040	dc01bbe3-d1bd-4de5-9295-a58cd5168d3c	13aa2067-8d79-4e62-95f8-96e49e059fe9
b97bf311-8ced-4c39-a50b-db7024cd46f6	c4566c9c-7412-4548-ae0b-e65351943294	1688db92-616d-4198-ad53-a0be9ceedcba
86953180-64d9-495b-8b2c-afcf8ed72756	d962acbe-1168-41f7-822a-806ee9b0729a	1688db92-616d-4198-ad53-a0be9ceedcba
355fd1da-ddf1-4d9d-87cc-89aa8464b521	e6a42128-6fb4-4dea-bd11-2e34be47c513	ab0c8d88-3f3b-41cc-809f-3cde159f2fad
a775f901-2d16-4447-8ac4-82d33e84634d	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	52c62675-fc63-422a-9a18-ec13ca8256b8
f8891194-e30e-427a-a4b2-1d0049e0608a	b4c8c6a8-d147-4f42-b12b-74adc397469f	d8ee7264-dfaa-4851-81dc-d94e529ad548
2a375ff9-f642-4785-bdaf-072364e557be	c4566c9c-7412-4548-ae0b-e65351943294	55939ea9-a45e-42b4-8603-ded4f2701070
d4cfd4de-53a2-434f-8fec-790b60c2d455	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	c287aadd-d73e-43b5-8223-813e59ed8350
21e1541e-ce19-4772-b68d-db6e810139cc	d962acbe-1168-41f7-822a-806ee9b0729a	d902d048-c851-4cc8-b19e-5936ccf928b7
73c60fd1-1639-459e-8f5b-7432e9c46d01	26e34441-4c27-4be0-948c-342e42221c41	d902d048-c851-4cc8-b19e-5936ccf928b7
198f3053-829e-45e7-a325-ed3694ab1eaa	d962acbe-1168-41f7-822a-806ee9b0729a	2022752e-1367-4834-8dae-099de55c5977
4606f350-fd41-4101-87bd-696076d313f6	e6a42128-6fb4-4dea-bd11-2e34be47c513	a5cb4ff0-5ca6-435c-b0c9-8efa963114ff
05b10307-25d1-455d-af4a-7e723c9d9562	d962acbe-1168-41f7-822a-806ee9b0729a	a5cb4ff0-5ca6-435c-b0c9-8efa963114ff
124e09e1-3643-4c3c-b3c5-8757021adcd4	e6a42128-6fb4-4dea-bd11-2e34be47c513	80349e8d-a048-4ded-9e45-2ed44d91915c
9b7caf35-d006-490d-905b-0a23f9634369	e6a42128-6fb4-4dea-bd11-2e34be47c513	3cce4b25-ed03-4615-9c07-009156e6c346
89b4fccd-72dd-4e7d-994a-fe36e61f21da	e6a42128-6fb4-4dea-bd11-2e34be47c513	39f35f74-b359-4703-90c3-bf89b9bc32b5
891d1dbc-7fa3-44a6-8bc7-30fae0ba737a	26e34441-4c27-4be0-948c-342e42221c41	59bfd806-93be-4b93-85ed-e985413ba43b
84acb0f9-a533-46d3-8803-4f3924a1f076	5afa840b-b4d3-4657-bdce-9c75c88d91b6	59bfd806-93be-4b93-85ed-e985413ba43b
d411b4fb-f890-4621-9f6b-207772c83e00	c4566c9c-7412-4548-ae0b-e65351943294	0ea8ef5f-909a-4aec-ba78-472a26bb618c
1e8aae03-cb28-41bc-9a86-5282c3311279	e6a42128-6fb4-4dea-bd11-2e34be47c513	28bbfaf5-c052-4315-9b89-221646c69b63
5a021ebd-01d3-4f7b-ae67-4418a6e37061	26e34441-4c27-4be0-948c-342e42221c41	0def10a3-503b-47b2-9ef3-45c42ef5bc28
c51b75c2-27b9-441b-ac8d-371141b338a7	9ee70a4b-75b2-45fa-b9f1-2f651a24e194	c3f61c29-3710-4502-89da-263ea482fd57
bbc8a180-7874-4e8e-b78f-5035eca3b1a2	c4566c9c-7412-4548-ae0b-e65351943294	c3f61c29-3710-4502-89da-263ea482fd57
e40ea0b9-c3ae-4805-a07b-6b68de8d1ad4	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	1afe313c-9ddc-445a-a189-57a654ac067b
3e399a72-d911-4abc-ab1f-aaa12551cb39	fe58dae6-3224-4b2e-8b45-4cd12cbbd83d	323a062a-bdb2-42c8-b57b-de9f968d6829
3c0bca69-ced8-4359-aee4-9c8c786c1c69	62739da4-e5ed-46ef-8345-d0182f80bad3	23641e11-f585-445d-9bac-5b3c4da603c8
38273933-bd46-4af5-b43a-c60dd9cb5826	d43b01df-84ee-4dc8-bc77-d7a566b59dbb	e2a6f6fd-8b5a-49cf-8404-1b854a51acbb
40c6a3e1-8a20-4e39-a016-a3e0e770f871	99b36b5f-0dc0-4715-8759-283353dcdec8	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0
5e62493b-e669-48ea-ad53-0b77803e87d8	17ddb3d6-ad88-49dd-9760-c0aa8583d177	fac35b8f-767d-466f-8ecf-5329226a4653
c2b2d8a0-223d-413d-a3c6-5bd7be93a884	b4c8c6a8-d147-4f42-b12b-74adc397469f	c79aa2b9-2f0a-4aca-a7a2-e8f3a301c6d7
4fdfc846-629c-4ae9-a4e9-31ba64b6f857	b4c8c6a8-d147-4f42-b12b-74adc397469f	c7279c93-060a-4b73-906a-4353b2ce1f15
a0359b96-d978-4951-b541-300901c51374	b4c8c6a8-d147-4f42-b12b-74adc397469f	57210a91-4e46-40ee-9e76-a6abd07189b1
d33b0eea-88c2-4b3d-8048-d735965df137	93afc76d-2b39-4e78-a699-a49c0db36b90	57210a91-4e46-40ee-9e76-a6abd07189b1
\.


--
-- Data for Name: PersonOfInterest; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PersonOfInterest" (id, name, description, "imageUrl", "STR", "DEX", "CON", "INT", "WIS", "CHA", "kingdomId", "cityId", "placeId", breed, sex, membership, languages, "districtId", "isForDM", ca, pv, "showOnMap", fp) FROM stdin;
5e8db395-6054-40e6-bd92-ef809166fa15	Hommes de Main du Syndicat (x5)	\nTraits\nAttaque Sournoise (2d6, 1/tour si allié adjacent ou avantage)\nSale Combine : avantage si la cible est à terre ou entravée.\nActions\nDague : +5, 1d4+3\nFilet (1/combat) : entrave (DEX DD 13)	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	\N	\N	CRIMINALITE	{}	\N	f	14	32	f	\N
5cfa3bc3-2645-4803-8e60-9e5239a224b6	Geani	<p>Femme, 24 ans, nouvelle épouse du roi <strong>David IV</strong> de Gandorènne. Menue et très jeune au milieu d'une cour qui ne l'est pas ; elle se tient droite par effort visible.</p>\n<p>Visage fin, teint clair, encore enfantin autour de la bouche. Cheveux blond vénitien relevés en coiffure de cour trop lourde pour elle. Yeux verts, souvent baissés en public et très directs quand ils ne le sont pas.</p>\n<p><strong>Voix :</strong> claire et légère, d'une politesse appliquée qui trahit l'apprentissage récent. Débit lent et prudent en présence du roi, nettement plus vif et spirituel dès qu'il quitte la pièce. Ne dit jamais « mon époux » : elle dit « le roi », comme tout le monde.</p>\n<p><strong>Rôle :</strong> nouvelle épouse du roi <strong>David IV</strong> de Gandorènne.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	7ccf7b24-0e5e-42e5-8493-76ee231c25ac	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
53f2f592-f1a7-4a7a-8e69-94f1f7e10392	Faith	<p>Femme, la trentaine. Grande et sèche, d'une maigreur nerveuse ; elle occupe un fauteuil de travers, une jambe par-dessus l'accoudoir, et personne ne s'y trompe sur qui commande la pièce.</p>\n<p>Visage anguleux, pommettes marquées, teint mat. Cheveux noirs coupés court et inégaux, comme faits au couteau. Yeux sombres, très fixes, avec un pli d'amusement permanent au coin. Plusieurs anneaux fins à l'oreille gauche, un par année de règne dit-on.</p>\n<p><strong>Voix :</strong> grave pour une femme, traînante, avec une pointe d'ironie qui ne la quitte jamais — elle donne un ordre du même ton qu'une plaisanterie, et c'est à l'interlocuteur de deviner. Débit lent et nonchalant, ponctué de silences pendant lesquels elle vous regarde sans ciller. Ne dit jamais le nom de quelqu'un qu'elle s'apprête à faire disparaître.</p>\n<p><strong>Rôle :</strong> meneuse de l'organisation criminelle du <strong>Syndicat d'Alagir</strong>, et liée à <strong>La Braise</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste volontairement compatible avec plusieurs.</em></p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	WOMAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
d1e9e544-2b9c-453b-b111-190c32add1cb	Ékénon Tracx	<p>Homme tieffelin, 41 ans. Grand, bâti comme un soldat de métier — épaules larges, poignets épais. Armure de plates noire aux reflets mats, cape pourpre aux armoiries royales.</p>\n<p>Peau d'un rouge sombre tirant vers le bordeaux, cornes noires recourbées vers l'arrière en arc élégant. Yeux jaunes à pupilles fendues, regard intense et peu confortable. Visage taillé et expressif, une fine cicatrice en travers du nez. D'autres cicatrices courent sur le dos des mains et le long du cou.</p>\n<p><strong>Voix :</strong> grave et sonore, avec une résonance de gorge très tieffeline qui met les interlocuteurs mal à l'aise sans qu'ils sachent pourquoi. Débit net et militaire, phrases courtes à l'impératif, aucun mot perdu. Ne s'adresse jamais au Roi autrement qu'en titre complet, y compris en privé — et note ceux qui s'en dispensent.</p>\n<p><strong>Rôle :</strong> capitaine et garde personnel du roi <strong>Pelfort Vanguard</strong> à Alagir.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	TIEFFELIN	MAN	MILITAIRE	{}	\N	f	\N	\N	f	\N
38e8071e-b2f2-4f88-ac70-4e3e80fd6f7d	Mirell “la Silencieuse”	<p>Femme humaine, âge apparent 30 ans. Grande et fine, à la peau dorée ; elle se déplace avec une lenteur mesurée. Vêtements sobres, presque modestes pour son métier.</p>\n<p>Traits doux. Cheveux noirs toujours attachés en une tresse serrée qui tombe dans son dos. Yeux ambrés, qui évitent souvent les regards directs.</p>\n<p><strong>Voix :</strong> feutrée et basse, d'où son surnom — elle <strong>parle peu</strong>, mais quand elle le fait, ses mots sont toujours choisis avec soin. Débit lent, presque sans accent tonique, avec une articulation nette qui rend chaque phrase étrangement définitive. Ne prononce jamais le nom du Syndicat à voix haute.</p>\n<p><strong>Personnalité :</strong> discrète, posée, presque effacée. Elle semble observer sans juger, ce qui la rend étrangement rassurante pour certains clients.</p>\n<p><strong>Rôle :</strong> à <strong>La Salamandre Savoureuse</strong>. Contrainte de travailler pour le <strong>Syndicat</strong>, elle sert parfois de messagère involontaire.</p>\n<p><strong>Secret (MJ) :</strong> elle pourrait demander l'aide des PJ pour fuir. Elle connaît un passage discret reliant l'étage à l'arrière de la taverne.</p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	WOMAN	CRIMINALITE	{COMMUN,NAIN,ELFIQUE,GNOME,HALFELIN,ARGOT_VOLEUR}	\N	f	\N	\N	f	\N
8c168c38-e7b9-41c2-8c19-31ab1291a61b	Sana Ivelis	<p>Femme, 56 ans, épouse d'<strong>Aimon Ivelis</strong>. Grande et solide, port d'apparat ; elle se tient toujours une demi-longueur en avant de son mari dans les réceptions, et personne n'a jamais osé le lui faire remarquer.</p>\n<p>Visage large et volontaire, mâchoire nette. Cheveux gris relevés en coiffure haute et complexe, tenue par des épingles d'or. Yeux bleus froids et évaluateurs — les seuls de la maison à ne pas être noisette.</p>\n<p><strong>Voix :</strong> nette et portante, d'une autorité tranquille qui n'a pas besoin de monter. Débit posé, avec une habitude redoutable de laisser un silence après une question au lieu de la reformuler. Emploie « nous » pour parler de Huriya, jamais pour parler d'elle et d'Aimon.</p>\n<p><strong>Rôle :</strong> épouse d'<strong>Aimon Ivelis</strong> ; co-dirige la cité libre de <strong>Huriya</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
88682d84-12ec-48fa-8ede-98a13e027b9f	Les Marteaux (x3) – Exécuteurs du conseil d'acier	Actions\nChaîne d’acier : entrave (FOR DD 13)\nMassue : 1d8+3\nRéaction – Interception : protège un allié adjacent	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	\N	CRIMINALITE	{COMMUN,ARGOT_VOLEUR}	\N	f	14	45	f	\N
5e18a870-5f4f-4065-b766-2a6c6c0691e4	Hirvel Soran	<p>Homme, 54 ans, corpulent. Lourd et lent, il s'installe et laisse venir ; robes luxueuses aux étoffes trop chargées pour le climat de Kalanos.</p>\n<p>Visage gras et luisant, bajoues, teint olivâtre. Cheveux noirs teints, ramenés sur le crâne. Yeux noirs petits et mobiles, qui évaluent en permanence. Bagues à presque tous les doigts.</p>\n<p><strong>Voix :</strong> onctueuse et traînante, avec des manières sournoises qui transparaissent dans les intonations avant les mots. Débit lent et sinueux, plein de compliments et de sous-entendus ; il pose ses conditions en ayant l'air de rendre service. Rit d'un petit rire humide après chacune de ses propres remarques.</p>\n<p><strong>Rôle :</strong> principal financier de <strong>Kalanos</strong>, avec de nombreuses connexions chez les marchands d'autres cités.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
c6f893d7-0646-4172-80dd-4798e47130d5	Ernil Sultaasar	<p>Homme elfe des bois, 167 ans, costaud — inhabituellement charpenté pour un elfe, épaules épaisses et avant-bras de lutteur.</p>\n<p>Visage carré, mâchoire forte, peau hâlée. Cheveux bruns bouclés retenus en arrière par un lacet de cuir. Yeux bruns calculateurs, qui balayent la salle par cycles réguliers. Oreilles effilées, l'une entaillée en haut.</p>\n<p><strong>Voix :</strong> basse et rare — il <strong>parle peu</strong>, et jamais le premier. Débit lent, réponses d'un ou deux mots, avec un temps d'attente avant chaque réponse pendant lequel il vous regarde. Quand il veut vraiment quelque chose, il ne le demande pas : il répète votre propre phrase, en enlevant un mot.</p>\n<p><strong>Rôle :</strong> tient le <strong>Monocle du Diable</strong> à Huriya. Voit tout, parle peu.</p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	ELFE	MAN	OTHER	{}	\N	f	\N	\N	f	\N
305f7912-1425-49b9-9529-3101b7649577	Maddox Vharn	<p>Homme, 54 ans. Trapu et large de torse, les bras épais d'un homme qui a frappé le métal avant de diriger ceux qui le frappent.</p>\n<p>Visage rond et rougeaud, sourcils épais, favoris gris. Cheveux gris fer coupés ras. Yeux bleus vifs, plissés. Une brûlure ancienne en étoile au creux du poignet droit.</p>\n<p><strong>Voix :</strong> puissante et sonore, calibrée pour dominer le bruit des presses ; il ne la baisse jamais, même en ville. Débit direct et bref, il tranche vite et n'aime pas revenir sur une décision. Ponctue ses phrases d'un « point final » qui vaut congé.</p>\n<p><strong>Rôle :</strong> dirige la fonderie privée <strong>La Frappe Brillante</strong> à Huriya, frappe de monnaie pour les deux empires. <strong>Doran Kell</strong> est son assistant.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
2847c5cb-9900-4979-9ef3-a33ca0480c01	Vedast Bolger	<p>Homme halfelin, 67 ans. Petit et rond, l'air d'un boulanger de village ; il enseigne assis sur un tabouret haut, les pieds ballants.</p>\n<p>Visage joufflu et avenant, joues roses. Cheveux bruns bouclés grisonnants, pieds velus soigneusement peignés. Yeux marron chaleureux derrière des besicles rondes. Tablier de dissection impeccablement propre, ce qui est plus troublant que l'inverse.</p>\n<p><strong>Voix :</strong> claire et enjouée, d'une bonhomie totalement inadaptée au sujet — il commente une éviscération du ton dont on donne une recette. Débit rapide et chantant, avec des « voilà, voilà » de satisfaction à chaque étape réussie. Ne hausse jamais le ton : quand un étudiant rate, il soupire, et c'est pire.</p>\n<p><strong>Rôle :</strong> professeur à la <strong>Nécrole</strong> de Brodnica.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	HALFELIN	MAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
149293d0-6af3-42ff-9d20-d61ee6cb087b	Tobrin Mullimax	<p>Homme halfelin, 51 ans. Petit et rond, la mise soignée d'un cadre qui tient à son rang ; gilet boutonné, montre à chaîne, chaussures cirées jusque sur les quais.</p>\n<p>Visage rond et avenant, favoris châtains grisonnants. Cheveux bouclés coupés court. Yeux noisette vifs, avec le plissement permanent de quelqu'un qui calcule un tonnage. Doigts courts et soignés.</p>\n<p><strong>Voix :</strong> claire et volubile, avec l'entrain commercial de la famille Mullimax. Débit rapide et enjôleur, riche en chiffres qu'il sort de mémoire et en anecdotes de trajet dont personne n'a besoin. Baisse la voix et se penche en avant pour les vraies affaires, réflexe si systématique qu'il le fait aussi pour commander à dîner.</p>\n<p><strong>Rôle :</strong> cadre de la <strong>Compagnie des Voiliers d'Éther</strong> à Huriya, transport fluvial.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
8dcd2a3d-5b74-4afb-a4c8-febb777dc3a4	Belina Tomasio	<p>Femme, 44 ans, épouse d'<strong>Esebio Tomasio</strong>. Petite et menue, tenue de cour impeccable ; elle se tient très droite et légèrement en retrait de son mari, position qu'elle a choisie.</p>\n<p>Visage fin aux traits réguliers, teint clair, poudré. Cheveux châtain foncé relevés en chignon bas. Yeux marron très attentifs, qui font le tour d'une réception en une passe. Bouche petite, sourire de convenance.</p>\n<p><strong>Voix :</strong> douce et parfaitement modulée, d'une amabilité de représentation ; elle demande des nouvelles avec une précision qui trahit un carnet tenu à jour. Débit fluide et sans aspérité, riche en formules. Quand elle veut transmettre quelque chose de sérieux, elle passe au dolomicien — que peu de gens à Brodnica comprennent.</p>\n<p><strong>Rôle :</strong> épouse d'<strong>Esebio Tomasio</strong>, au palais du comte.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
fa898d26-72c6-4fa4-958d-5769659f0c96	Volodar Ivelis	<p>Homme, 48 ans, membre de la famille dirigeante <strong>Ivelis</strong>. Corpulent et pesant, le geste rare ; il s'installe dans un fauteuil pour la soirée entière.</p>\n<p>Visage empâté, mâchoire lourde héritée d'Aimon. Cheveux châtains clairsemés, ramenés en travers. Yeux noisette perçants — le regard des Ivelis, sous des paupières tombantes. Teint coloré.</p>\n<p><strong>Voix :</strong> grasse et lente, légèrement essoufflée ; il ménage son souffle et laisse traîner les fins de phrase. Débit indolent, plein de sous-entendus et de demi-mots, comme s'il en savait toujours plus qu'il n'en dit — ce qui est parfois vrai. Rit d'un souffle nasal, sans ouvrir la bouche.</p>\n<p><strong>Rôle :</strong> membre de la famille dirigeante <strong>Ivelis</strong> de Huriya.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
3b13e7da-97ed-49b5-9bf0-8bd21f8c27f3	Kerrhylon Fax	<p>Homme drakéide, 43 ans. Haut et sec, la posture raide ; il porte des vêtements civils avec une gêne de militaire déguisé.</p>\n<p>Écailles brun-rouge mates, ternies aux jointures. Cornes courtes, l'une ébréchée. Yeux verticaux d'un jaune pâle. Une cicatrice claire barre les écailles de la gorge.</p>\n<p><strong>Voix :</strong> grondante et basse, avec le sifflement drakéide sur les sifflantes ; elle attire l'attention, ce qui est un handicap dans son métier et l'oblige à parler peu. Débit bref et rigide, en phrases de rapport. Ne s'adresse jamais le premier à un inconnu.</p>\n<p><strong>Rôle :</strong> rang Tours 2 de la cellule de l'<strong>Œil Pourpre</strong> à Russolio.</p>	\N	10	10	10	10	10	10	\N	bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	\N	DRAKEIDE	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
7d77cf6b-32a9-4f0e-b9b8-42686a558aed	Qualen Pilwicken	<p>Homme gnome, 118 ans. Petit et sec, la posture cassante ; il se fait porter sur un siège surélevé pour siéger au Magisterium et n'en descend jamais devant témoin.</p>\n<p>Visage dur et anguleux, rare chez un gnome. Cheveux blancs coupés au bol. Sourcils épais. Yeux noirs durs et fixes. Robes de magister trop grandes, brodées de sigles d'invocation.</p>\n<p><strong>Voix :</strong> haut perchée et tranchante, qui porte de façon déplaisante et qu'on n'interrompt pas. Débit sec et rapide, sans une politesse ; il énonce des décisions, pas des propositions. Prononce les formules d'invocation dans un registre plus grave — beaucoup plus grave que sa gorge ne devrait le permettre.</p>\n<p><strong>Rôle :</strong> archimage et représentant de <strong>Russolio</strong> au <strong>Magisterium</strong>. École d'invocation. Gère une ville lourdement armée, avec commerce d'esclaves drakonides.</p>	\N	10	10	10	10	10	10	\N	bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	\N	GNOME	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
a53690fb-61a0-4d05-b05b-9eefc5b0f213	Tharim Dastren	<p>Homme robuste, 47 ans, aux <strong>mains calleuses</strong>. Large et solide, le pas lourd des hommes du sous-sol ; il s'assoit sur le bord des chaises, prêt à se relever.</p>\n<p>Visage large, buriné, teint rouge. <strong>Barbe rousse</strong> fournie et mal égalisée. Cheveux roux grisonnants coupés court. Yeux gris-bleu francs, plissés par l'habitude de la lampe.</p>\n<p><strong>Voix :</strong> forte et rocailleuse, calibrée pour les galeries ; il la garde telle quelle dans les salons, au grand dam des Elvaltis. Débit direct et sans détour, il dit ce qu'il pense de leur gestion à ceux qui la font. Marque un temps et se frotte la nuque avant de contredire — signal que tout Kalanos a appris à reconnaître.</p>\n<p><strong>Rôle :</strong> expert du sous-sol de <strong>Kalanos</strong>, fidèle allié des <strong>Elvaltis</strong>, parfois en désaccord avec leur gestion.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
012a0dc7-3805-4718-a246-33e4d9995757	Gilly FortPied	<p>Homme, 38 ans. Petit et râblé, toujours en mouvement ; il arpente les entrepôts d'un pas rapide, tablette sous le bras.</p>\n<p>Visage carré et hâlé, mâchoire volontaire. Cheveux bruns coupés ras. Yeux gris, directs. Des mains larges et abîmées, et des bottes toujours crottées, y compris au bureau.</p>\n<p><strong>Voix :</strong> forte et brusque, habituée aux quais ; elle contraste avec les manières feutrées de son directeur. Débit rapide et sans détour, il annonce les mauvaises nouvelles en premier. Jure abondamment, sauf devant <strong>Fulrad</strong>, où il s'arrête au milieu du mot.</p>\n<p><strong>Rôle :</strong> responsable opérationnel de la <strong>C.C.C.H</strong> à Brodnica.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
6e481cba-8452-4313-b805-f6130c319f62	Akara du clan Thrahak	<p>Femme naine, 73 ans. Trapue et sèche, musculature de cavalière ; les jambes arquées par des décennies de selle.</p>\n<p>Visage anguleux, tanné par le vent des hauts plateaux. Cheveux roux sombre tressés en une natte unique, très serrée. Yeux gris acier. Une marque au fer, discrète, à l'intérieur du poignet gauche.</p>\n<p><strong>Voix :</strong> rauque et brève, avec l'accent guttural du clan Thrahak sur les gutturales. Débit économe, en phrases de rapport ; elle donne l'information et se tait. Ne dit jamais « oui » — elle hoche une fois, sèchement.</p>\n<p><strong>Rôle :</strong> naine du <strong>clan Thrahak</strong>, rang Cavalier 2 de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>	\N	10	10	10	10	10	10	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	NAIN	WOMAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
df5558c9-d6c2-42b0-982f-1561ac22343a	Crampernap Scheppen	<p>Homme gnome, 64 ans. Menu et sec, le dos rond ; il se faufile dans les ruelles de Russolio avec une aisance que sa démarche traînante ne laisse pas deviner.</p>\n<p>Visage étroit et fripé, menton en galoche. Cheveux gris hirsutes sous un bonnet de laine qu'il ne quitte jamais. Yeux marron fuyants, jamais fixés plus d'un instant.</p>\n<p><strong>Voix :</strong> nasillarde et geignarde, celle d'un homme qui se plaint par métier ; on cesse vite de l'écouter, et c'est exactement ce qu'il veut. Débit lent et plaintif, avec une manie de répéter la fin de ses propres phrases. Change brusquement de registre — net, bas, rapide — quand il transmet.</p>\n<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Russolio.</p>	\N	10	10	10	10	10	10	\N	bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	\N	GNOME	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
4c40a684-0bce-4fd8-b6bb-83b58709b421	Elivara Tanis	<p>Femme, 57 ans, grande et imposante. Port ample et calme ; elle entre lentement dans une pièce et la tension y baisse d'un cran.</p>\n<p>Cheveux argentés portés longs et libres. Visage large aux traits apaisés, teint clair. Yeux gris limpides, d'une attention totale. Mains ouvertes, toujours visibles.</p>\n<p><strong>Voix :</strong> <strong>douce mais ferme</strong>, d'une chaleur sans complaisance ; elle ne s'élève jamais et n'a jamais eu besoin de le faire. Débit lent et posé, avec des silences qu'elle laisse aux autres pour qu'ils s'entendent parler. Reformule systématiquement la position de chacun avant de proposer la sienne — l'outil qui fait d'elle une médiatrice.</p>\n<p><strong>Rôle :</strong> conscience spirituelle de <strong>Kalanos</strong>, médiatrice entre les factions.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	WOMAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
53ab6d68-6d6d-4d29-af36-0982564af74d	Brise-Terre (x5)	Élite des Beor Khan.\n\nAction : Marteau tellurique +7 (2d6+4 contondant).\nCapacités : Onde de Fracture (Recharge 5–6) — créatures à 10 ft., JS DEX DD 15 ou 2d8 contondant + à terre ; Endurance des Steppes — à 0 PV, JS CON DD 10 → reste à 1 PV en cas de réussite.	\N	18	12	16	10	12	13	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	\N	MILITAIRE	{}	\N	f	16	68	f	\N
608b70c9-bf82-4fcb-8d6a-b64cf7b78683	Cavalier des Steppes (x90)	Unité de cavalerie légère des Beor Khan. CA 14 (cuir renforcé).\n\nActions : Lance de cavalerie +4 (1d12+2 perforant), Arc composite +4 portée 80/320 ft. (1d8+2 perforant).\nCapacité : Charge des Steppes — après 20 ft. en ligne droite, +1d8 dégâts supplémentaires.\nCompétences : Survie +4, Perception +2, Dressage +4.	\N	14	15	12	10	11	10	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	\N	MILITAIRE	{}	\N	f	14	27	f	\N
cd665704-3386-4cca-b611-7c7d76a65876	Chaman des Collines (x3)	Druide itinérant des Beor Khan. DD sorts 14, attaque magique +6.\n\nSorts : Druidcraft & Guidance (à volonté) ; Entangle, Fog Cloud, Thunderwave (3/jour) ; Call Lightning (1/jour).\nAction : Bâton rituel +4 (1d6 contondant + 1d6 foudre).\nCapacité : Voix des Esprits — alliés à 9 m : avantage contre peur et +2 Perception.	\N	9	12	12	13	17	14	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	\N	RELIGEUX	{}	\N	f	13	45	f	\N
32f901e7-8a07-44df-8854-b00536c41603	Dorian Rigart	<p>Homme humain, 68 ans. Grand et sec, le dos tenu droit par habitude plus que par force ; mains larges de docker qu'aucune décennie de bureau n'a affinées.</p>\n<p>Visage long et creusé, favoris blancs, cheveux clairsemés ramenés en arrière. Yeux gris fatigués, aux paupières tombantes. Teint de quelqu'un qui a passé quarante ans au vent du port.</p>\n<p><strong>Voix :</strong> grave et usée, avec un fond d'enrouement permanent. Débit lent ; il commence ses phrases par un raclement de gorge qui lui tient lieu de ponctuation. Parle des quais au présent et de sa société au passé.</p>\n<p><strong>Rôle :</strong> père d'<strong>Eldric Rigart</strong> et fondateur des entrepôts des quais d'Alagir (évoqué au discours du port, Partie 5).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	\N	\N	f	\N
10ee53f4-ad08-4290-a61a-671be30bd140	Bilbron Nucklestamp	<p>Homme, 91 ans, archimage. Petit et voûté, presque escamoté dans des robes trop grandes ; il lévite de quelques centimètres quand il est distrait, sans s'en apercevoir.</p>\n<p>Visage étroit et ridé, nez long. Barbe blanche et fine, nouée en trois endroits. Sourcils broussailleux. Yeux noirs perçants, disproportionnés dans un si petit visage. Doigts constamment en mouvement, comme s'ils traçaient des runes.</p>\n<p><strong>Voix :</strong> haute et sèche, avec un timbre cassant qui porte mal mais qu'on n'ose pas faire répéter. Débit rapide et impatient, saturé de termes techniques et d'apartés ; il répond souvent à la question qu'on aurait dû poser. S'interrompt pour se corriger lui-même à voix haute, puis reprend.</p>\n<p><strong>Rôle :</strong> archimage.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	\N	\N	\N	MAN	OTHER	{COMMUN}	\N	f	\N	\N	t	\N
7b2ec74b-dd52-4532-b35a-ce8a967f84aa	Guerrier Beor Khan (x120)	Fantassin d'élite des tribus Beor Khan. \narmure enpeaux épaisses et os.\n\nActions : Hache courbe +5 (1d10+3 tranchant), Javelot +5 portée 30/120 ft. (1d6+3 perforant).\nCapacité : Rage tribale 1/jour — 1 min, résistance dégâts physiques non-magiques et +2 dégâts mêlée.\nRésistance : Avantage aux jets de sauvegarde contre la peur.	\N	16	13	14	9	12	11	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	\N	MILITAIRE	{}	\N	f	15	38	f	3
8ef5bbf7-606e-4c5d-a427-57698e1072f8	Acolyte Pourpre	Fanatique de base du Soleil Pourpre, souvent utilisé comme recrue endoctrinée ou serviteur de rituel.\nAction : Dague rituelle +4, 1d4+2 perforant + 1d4 feu.\nCapacité : Zèle Pourpre — avantage contre l'état effrayé tant qu'un supérieur du Soleil Pourpre est visible.	\N	11	14	12	10	12	13	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	13	18	f	1/2
656809e7-16fc-4426-bea1-e959b3b3ca61	Soldat du Soleil Pourpre	Troupe régulière du Soleil Pourpre, utilisée comme garde de sanctuaire, escorte ou patrouilleur urbain.\nMultiattaque : 2 attaques de cimeterre ou de lance.\nCapacités : Formation Fanatique (+1 CA adjacent à un allié), Dernier Serment (attaque à 0 PV, 1/jour).	\N	15	13	14	10	12	11	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	16	38	f	2
3404bc03-fafd-4973-a52a-7abe5cc45f7b	Ilrune Ivelis	<p>Homme, 31 ans, fils de la famille <strong>Ivelis</strong>. Taille moyenne, mince, mise soignée de négociant plutôt que de prince ; il voyage plus qu'il ne siège.</p>\n<p>Visage fin, barbe courte entretenue. Cheveux châtain foncé coiffés en arrière. Yeux noisette perçants — le regard des Ivelis. Deux rides verticales déjà installées entre les sourcils.</p>\n<p><strong>Voix :</strong> posée et agréable, celle d'un homme qui a appris à conclure des affaires loin de chez lui. Débit fluide et pragmatique, riche en chiffres et en échéances, sans emphase de cour. Emploie « nous » pour la compagnie et « la famille » pour les Ivelis — jamais l'inverse.</p>\n<p><strong>Rôle :</strong> fils de la famille <strong>Ivelis</strong>, associé à la compagnie de transport <strong>Rigart &amp; fils</strong> (fondée par le père d'Illevas).</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
0904898f-3d31-40cc-8578-6c1edfaecb08	Lauc Kinemor	<p>Homme, 47 ans, membre de la famille royale <strong>Kinemor</strong>. Massif et empâté, le pas lourd ; il tient mal debout longtemps et le cache par des poses assises étudiées.</p>\n<p>Visage large et coloré, double menton naissant. Cheveux blond cendré coupés court, dégarnis au front. Yeux bleu pâle, injectés. Doigts boudinés couverts de bagues.</p>\n<p><strong>Voix :</strong> forte et pâteuse, avec l'accent pointu momoritanien un peu mâché. Débit lourd et péremptoire, il assène plus qu'il n'argumente et coupe la parole sans s'en rendre compte. Répète « évidemment » pour combler ce qu'il ne sait pas.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
b7f624df-cfdf-4cd8-8752-1292d476be1c	Norima Kinemor	<p>Femme, 52 ans, membre de la famille royale <strong>Kinemor</strong>. Grande et sèche, port rigide ; elle reste debout par principe pendant les audiences.</p>\n<p>Visage long et anguleux, teint très pâle. Cheveux blond cendré striés de blanc, tirés en arrière sans une mèche libre. Yeux bleu pâle, glacés. Bouche mince, rarement détendue.</p>\n<p><strong>Voix :</strong> sèche et coupante, l'accent pointu momoritanien porté comme une arme. Débit bref et impérieux, sans formule de politesse superflue ; elle interpelle les gens par leur fonction, jamais par leur nom. Ne pose pas de question : elle formule une attente.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
380d8316-3a6f-40fc-b9f4-5df799f4cf14	Lady Lyra Astrebois	<p>Femme humaine, 36 ans. Grande et fine, d'une maigreur sèche ; épaules et dos très développés par l'arc, ce qui déséquilibre sa silhouette au premier regard.</p>\n<p>Visage étroit et hâlé, pommettes marquées. Cheveux blond foncé tressés serré et enroulés à l'arrière. Yeux gris-vert d'une acuité remarquable, plissés en permanence par des années à juger des distances. Deux doigts de la main droite marqués d'une corne épaisse.</p>\n<p><strong>Voix :</strong> claire et sèche, projetée haut pour passer par-dessus une ligne d'archers. Débit bref et cadencé, en commandements de trois syllabes — « Encochez », « Tendez », « Lâchez » — qu'elle emploie aussi, par habitude, hors du champ de tir. Ne parle jamais pendant qu'elle vise, et lève simplement deux doigts pour qu'on se taise.</p>\n<p><strong>Rôle :</strong> Archer d'Élite — Capitaine des Archers de la <strong>Garnison des écus d'or</strong>. Neutre.</p>\n<p><strong>Capacités notables :</strong> PV 102 · CA 17. Œil du Faucon : ignore le demi-couvert. Volée Coordonnée : amplifie ses archers.</p>	\N	11	20	18	14	16	13	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	HUMAIN	WOMAN	MILITAIRE	{}	\N	f	17	102	f	\N
97d00715-a9d7-4ad3-9506-1e23a2f6e434	Garde des Écus d'Or	Fantassin de base de la Garnison des Écus d'Or. Loyal neutre. Formé à combattre en formation défensive (+1 CA adjacent à un allié).	\N	14	12	12	10	11	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	HUMAIN	\N	MILITAIRE	{}	\N	f	16	27	f	\N
16fd6442-836d-4a3d-a3f5-12d9ce6bfe18	Archer des Écus	Archer de la Garnison des Écus d'Or. Loyal neutre. Tir Groupé : +1 toucher si un allié adjacent cible le même ennemi.	\N	10	16	12	10	13	9	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	HUMAIN	\N	MILITAIRE	{}	\N	f	15	22	f	\N
3619cf19-1247-487a-90e9-809a5f7151cc	Lame Incandescente	Assassin et éclaireur fanatique du Soleil Pourpre.\nMultiattaque : 2 attaques de lame courte.\nCapacités : Attaque sournoise (+3d6), Pas de Braise (3/jour), Fumée Pourpre (1/jour).	\N	12	18	14	12	13	14	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	15	52	f	4
f05886e6-dc07-490e-bef6-cfadddc95564	Porte-Flamme Pourpre	Mage de bataille du Soleil Pourpre.\nSorts : Mains brûlantes, Image miroir, Boule de feu ou Contresort.\nCapacités : Cendre protectrice (+2 CA réaction, 3/jour), Flamme doctrinale (alliés +1d4 feu, recharge 5-6).	\N	9	14	16	16	12	15	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	14	66	f	5
df59f6a7-ad3b-4e8c-b767-2e58b4bdade9	Gardien du Brasier	Élite lourde du Soleil Pourpre, souvent garde du corps des officiers.\nHallebarde pourpre : +7, 1d10+4 tranchant + 1d6 feu, allonge 3m.\nCapacités : Mur Pourpre, Interposition, Résistance au feu.	\N	18	11	17	10	13	12	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	18	95	f	6
4cd6a190-165b-4c50-919c-be6cfb3964a1	Alménia Kinemor	<p>Femme, 34 ans, membre de la famille royale <strong>Kinemor</strong>. Grande et mince, maintien de cour momoritanien — épaules effacées, menton haut.</p>\n<p>Visage allongé, teint très clair, sourcils fins. Cheveux blond cendré relevés en coiffure haute. Yeux bleu pâle, distants. Peu de bijoux, mais tous de grande valeur.</p>\n<p><strong>Voix :</strong> claire et froide, avec l'accent pointu des hautes sphères momoritaniennes. Débit lent et articulé, riche en formules d'étiquette derrière lesquelles elle ne s'engage jamais. Marque une pause avant de prononcer un nom roturier, comme si elle vérifiait qu'il existe.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
1d1e4325-7323-4b8f-a73c-28a416d31803	Inquisiteur du Soleil Pourpre	Interrogateur et traqueur de dissidents.\nFouet de braise : +6, allonge 3m, 1d6+3 + 2d6 feu.\nRegard accusateur : JS SAG DD 14 ou effrayé.\nSorts : Détection des pensées, Suggestion, Modify Memory.	\N	12	16	14	15	16	17	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	16	78	f	7
57723973-8294-4642-ac88-6890c04984a7	Fanatique Écarlate	Kamikaze rituel du Soleil Pourpre.\nExplosion de foi : à 0 PV, créatures à 3m — JS DEX DD 13, 2d6 feu.\nCapacités : Marche sans peur, Chant de l'Ignis.	\N	14	14	14	8	11	13	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	13	32	f	2
09d82ceb-5d5a-4b96-bb8b-c600fd01ee72	Essel Vaanmyr	<p>Femme haute elfe, d'apparence indéfinissable — entre deux cents et quatre cents ans selon les rumeurs. Grande et fine, elle se déplace avec une lenteur délibérée qui donne l'impression qu'elle glisse plutôt qu'elle ne marche. Robes sombres à broderies géométriques, une bague à chaque main, chacune gravée d'une formule différente. Doigts invariablement tachés d'encre violette.</p>\n<p>Peau d'un blanc nacré légèrement bleuté à la lumière du soir. Cheveux d'un noir d'encre relevés en un chignon architectural maintenu par deux plumes de corbeau réelles. Visage allongé, traits fins, nez légèrement busqué ; oreilles effilées dépassant à peine de la coiffure. Yeux d'un gris très pâle, presque argenté — ils donnent parfois l'impression de voir à travers les gens plutôt qu'en eux.</p>\n<p><strong>Voix :</strong> ténue et parfaitement posée, d'un calme qui ne varie jamais ; elle <strong>parle peu</strong> et sourit rarement. Débit très lent, avec de longs silences qu'elle n'éprouve aucun besoin de combler — elle écoute avec une attention totale qui peut mettre ses interlocuteurs mal à l'aise. Ne pose jamais deux fois la même question : si on élude, elle attend.</p>\n<p><strong>Rôle :</strong> propriétaire de <strong>La Plume du Corbeau</strong>.</p>	\N	9	16	12	19	16	14	\N	57171985-dade-4fcc-a00b-c06de058c7d6	bcd0f4f4-c967-4184-a201-1bd7e0d3d88e	ELFE	WOMAN	MARCHAND	{COMMUN,ELFIQUE}	\N	f	13	38	f	3
7f674dac-162b-4243-8e77-7362d636a241	Officier Solarius	Chef d'escouade du Soleil Pourpre.\nMultiattaque : 2 attaques d'épée longue.\nÉpée solaire pourpre : +6, 1d8+3 + 1d6 feu.\nCapacités : Aura de Commandement, Discipline de Fer.	\N	16	14	16	13	14	17	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN}	\N	f	17	88	f	6
70ec3e88-19f2-4b45-9f1a-a6cf0e424b82	Ivano Tomasio	<p>Homme, 19 ans, de la <strong>Famille Tomasio</strong>. Grand et dégingandé, encore en train de s'étoffer ; il ne sait pas quoi faire de ses mains dans les réceptions.</p>\n<p>Visage long hérité d'<strong>Esebio</strong>, teint olivâtre, duvet de barbe mal assuré. Cheveux noirs épais et bouclés. Yeux marron foncé, vifs et curieux.</p>\n<p><strong>Voix :</strong> encore mal assise, qui dérape dans l'aigu au mauvais moment et qu'il rattrape en toussant. Débit rapide et enthousiaste, avec un accent dolomicien plus marqué que celui de son père — il a grandi là-bas. S'arrête net au milieu d'une phrase dès que sa mère le regarde.</p>\n<p><strong>Rôle :</strong> membre de la <strong>Famille Tomasio</strong> (comtes des Dolomites), au palais du comte de Brodnica.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	\N	\N	\N	MAN	OTHER	{COMMUN}	\N	f	\N	\N	t	\N
cea2b827-0f64-4644-b53a-934619178521	Kaelen Voss	<p>Homme humain, ~40 ans. Silhouette fine et athlétique, économe de ses gestes ; il ne fait jamais un pas de trop et se tient toujours à portée d'une sortie.</p>\n<p>Cheveux noirs courts. Visage impassible, traits nets, rasé de près. <strong>Yeux gris métalliques</strong>, fixes et sans expression lisible.</p>\n<p><strong>Voix :</strong> basse et parfaitement égale — d'où son surnom de « <strong>Voix Silencieuse</strong> » : elle ne dépasse jamais le volume strictement nécessaire, si bien que ses hommes doivent s'immobiliser pour l'entendre. Débit lent, phrases courtes, aucune répétition. N'a jamais élevé le ton de mémoire de garnison ; quand il est mécontent, il se contente de se taire.</p>\n<p><strong>Rôle :</strong> commandant de la garnison de <strong>La Main du Silence</strong>. Méthodique, calculateur, loyal à la Main.</p>\n<p><strong>Capacités notables :</strong> FP 7 · PV 105. Multiattaque ; lame silencieuse (+7, 1d8+4 + 2d6 poison), arbalète ; attaque sournoise +4d6, évasion, disparition tactique (invisibilité 1 tour, recharge 5-6).</p>	\N	14	18	16	15	16	14	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	23641e11-f585-445d-9bac-5b3c4da603c8	HUMAIN	MAN	\N	\N	\N	f	17	105	f	7
c1debe50-c816-4db1-9cb1-8395109675a9	Ilseva Dawnthread	<p>Femme humaine, d'une quarantaine d'années, au visage qui semble plus vieux et plus jeune à la fois selon l'angle où on la regarde. Robes flottantes aux teintes de nuit — bleu nuit, violet sombre, gris perle — avec des broderies de fil argenté représentant des constellations. Autour du cou, un pendentif en verre soufflé contenant un liquide laiteux qui change de couleur selon l'humeur.</p>\n<p>Sa caractéristique la plus frappante : des cheveux d'un blanc pur, épais et ondulés, qui lui tombent aux épaules — blancs depuis ses vingt ans, dit-on, après un incident dont elle ne parle jamais. Visage ovale, peau légèrement mate avec de fins traits autour des yeux. Ces yeux sont d'un bleu-gris trouble, semblables à un ciel de brume — ils ont cette qualité troublante de regarder légèrement au-dessus de l'interlocuteur, comme si elle voyait quelque chose que les autres ne voient pas. Lèvres fines, souvent esquissant un sourire énigmatique.</p>\n<p><strong>Voix :</strong> douce et sans hâte, avec un léger décalage qui donne l'impression qu'elle répond à la question précédente. Débit très lent : elle prend son temps, laisse des silences, et <strong>finit souvent ses phrases par une question en retour</strong>. Ne dit jamais « je ne sais pas » — elle dit « pas encore ».</p>\n<p><strong>Rôle :</strong> propriétaire de <strong>La Prophétie</strong>.</p>	\N	9	13	11	16	18	17	\N	57171985-dade-4fcc-a00b-c06de058c7d6	b2a3649c-ddc3-45a0-98fb-1f2453713afd	HUMAIN	WOMAN	MARCHAND	{COMMUN}	\N	f	12	28	f	2
316845f4-28fa-4cec-bd97-0c0454f4e300	Sorqa Drenval	<p>Femme naine, d'une cinquantaine d'années, trapue et musclée, au port droit d'une femme habituée à porter une armure toute sa vie. Elle porte en permanence un tablier de cuir épais par-dessus une chemise à manches retroussées, des gants de travail glissés dans sa ceinture. Autour du cou, une plaque de métal gravée : l'insigne de son ancienne compagnie de mercenaires, les <strong>Marteaux d'Argent</strong>.</p>\n<p>Teint cuivré, visage carré, pommettes hautes. Tresses noires striées de gris, serrées en deux nattes épaisses qui tombent sur les épaules. Avant-bras entièrement couverts de tatouages runiques bleu-noir — chaque rune représente un ennemi vaincu ou un serment honoré. Yeux brun-ambré perçants, rarement distraits.</p>\n<p><strong>Voix :</strong> grave, posée, directe, sans une once d'emphase. Débit bref et définitif : elle <strong>ne brade rien et n'explique pas deux fois</strong>. Reconnaît instantanément un vrai combattant d'un touriste qui joue à l'aventurier — et le second s'entend répondre par un seul mot.</p>\n<p><strong>Rôle :</strong> propriétaire de <strong>La Valkyrie Rayée</strong>.</p>	\N	16	11	16	13	14	12	\N	57171985-dade-4fcc-a00b-c06de058c7d6	74267976-27df-4d73-b736-b72bf1ddb19f	NAIN	WOMAN	MARCHAND	{COMMUN,NAIN}	\N	f	14	58	f	4
253a5d7d-a2de-46ab-ae40-366e5ab5543a	Delmira Soss	<p>Femme humaine, d'une quarantaine d'années bien sonnées, solide et directe, aux mains calleuses d'une artisane qui n'a jamais cessé de travailler de ses doigts malgré son rang. Tenue de travail de qualité — chemise de lin crème, gilet de cuir brun aux nombreuses poches, tablier de forge replié à la ceinture lorsqu'elle reçoit des visiteurs. Un insigne en or frappé à la fleur de lys de Gandorenne épinglé sur son revers.</p>\n<p>Cheveux châtains coupés court, profil net avec un nez légèrement cassé — souvenir d'un accident de forge dans sa jeunesse — et des yeux verts d'une franchise presque intimidante.</p>\n<p><strong>Voix :</strong> ample et assurée, dressée à couvrir le vacarme des marteaux ; elle garde ce volume en réunion et ne s'en excuse pas. Débit franc et rapide, sans détour ni diplomatie — elle dit ce qu'elle pense d'une pièce mal frappée devant celui qui l'a frappée. Se durcit d'un coup, sèche et brève, dès qu'on prononce le mot « Momoritanie ».</p>\n<p><strong>Rôle :</strong> Maître-Frappeur en chef de la <strong>Fonderie Royale de Gandorenne</strong> à Huriya. Appréciée pour son efficacité et sa loyauté envers le Royaume.</p>\n<p><strong>Secret (MJ) :</strong> elle nourrit une certaine amertume envers la <strong>Momoritanie</strong>, dont la fonderie rivale bénéficie selon elle d'un traitement de faveur de la part de la <strong>Garnison</strong>.</p>	\N	14	13	14	15	14	13	\N	57171985-dade-4fcc-a00b-c06de058c7d6	648113c1-93ea-4f74-8786-318fed58f4c8	HUMAIN	WOMAN	MARCHAND	{COMMUN}	\N	f	13	44	f	3
8955d55d-8825-40ce-a237-d0554350b136	Calison Kinemor	<p>Homme, 29 ans, membre de la famille royale <strong>Kinemor</strong>. Grand et svelte, allure d'escrimeur de salon ; il s'appuie volontiers aux cheminées en posant.</p>\n<p>Visage fin et pâle, mâchoire délicate. Cheveux blond cendré ondulés, portés mi-longs. Yeux bleu pâle, paupières lourdes. Une moustache fine qu'il retouche souvent.</p>\n<p><strong>Voix :</strong> claire et traînante, avec l'accent pointu des hautes sphères momoritaniennes qu'il exagère par pose. Débit nonchalant, semé d'esprit et de piques ; il parle de tout avec le même détachement amusé. Le ton se brise net, sec et bref, dès qu'il est réellement contrarié.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
5aca83b1-05fe-4396-9a2b-bbc21a360f9b	Cumpen Horcus	<p>Homme gnome, 82 ans. Petit et maigre, agité ; il ne tient pas en place et manipule constamment un objet — une pièce, une clé, un caillou.</p>\n<p>Visage en lame, pommettes hautes, teint gris. Cheveux poivre et sel en bataille. Yeux verts très clairs, exorbités, qui donnent une impression de folie contrôlée. Un sourire de travers.</p>\n<p><strong>Voix :</strong> aiguë et saccadée, avec des ruptures de ton imprévisibles qui déstabilisent ses interlocuteurs. Débit décousu en apparence — il saute d'un sujet à l'autre — mais chaque digression ramène à l'information qu'il cherchait. Rit à contretemps.</p>\n<p><strong>Rôle :</strong> rang Fou 2 de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>	\N	10	10	10	10	10	10	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	GNOME	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
6339c956-1d05-46f3-a430-a84c27f68b7d	Osver Krann	<p>Homme humain, cinquante ans, mince et voûté, au teint presque gris de quelqu'un qui travaille à la lumière artificielle depuis vingt ans. Vêtements d'excellente qualité, toujours sombres — gris, noir, marine — impeccablement tenus. Il porte des gants de travail en peau ultra-fine même pour recevoir des clients : protection contre les résidus, dit-il.</p>\n<p>Crâne dégarni sur le dessus, frangé d'une couronne de cheveux blancs coupés court. Visage anguleux, presque cadavérique si ce n'était la vivacité des yeux gris acier. Ses mains sont ses attributs les plus remarquables : longues, fines, d'une précision de chirurgien, couvertes de légères taches chimiques indélébiles.</p>\n<p><strong>Voix :</strong> sèche et feutrée, parfaitement neutre, sans la moindre curiosité audible — c'est son argument commercial autant que sa manière. Débit lent et net, phrases courtes, uniquement des faits, des délais et des prix. N'emploie jamais de nom propre en présence d'un tiers.</p>\n<p><strong>Rôle :</strong> propriétaire du <strong>Creuset des Richesses</strong> et alchimiste-monnayeur de haut vol. Il ne pose jamais de questions sur l'origine des métaux qui lui sont confiés — c'est sa règle d'or. En contrepartie, ses honoraires sont parmi les plus élevés de Huriya, et il refuse tout client qui lui semble imprévisible ou susceptible de créer des problèmes.</p>	\N	9	14	11	19	16	14	\N	57171985-dade-4fcc-a00b-c06de058c7d6	3224c898-95b2-4737-b460-969d81c1e5bc	HUMAIN	MAN	MARCHAND	{COMMUN}	\N	f	12	30	f	2
2f92433f-2dcb-4066-b792-27f69e99c84f	Serget Halvorn	<p>Homme nain, cinquante ans, court et massif, aux bras qui feraient rougir un mineur de profession. Uniforme de la Garnison modifié pour le travail — manteau court aux insignes de la Frappe, tablier de forge renforcé.</p>\n<p>Barbe rousse tirant sur le gris, tressée en deux nattes maintenues par des anneaux de cuivre — tradition sur quatre générations de forgerons. Visage large et rougeaud par les années passées près des fourneaux, une cicatrice horizontale sur la joue gauche, métal en fusion, il y a quinze ans. Yeux vert bouteille toujours à moitié plissés, habitués à juger un alliage au premier coup d'œil.</p>\n<p><strong>Voix :</strong> grondante et forte, avec le débit d'un homme qui n'a jamais appris à parler bas et n'en voit pas l'intérêt. Phrases courtes et catégoriques, aucune place pour le conditionnel. Devient carrément tonitruant sur deux sujets : les contrefacteurs et les comptes-rendus incomplets, qu'il déteste par-dessus tout.</p>\n<p><strong>Rôle :</strong> Maître-Frappeur de la <strong>Fonderie de l'Écus d'Or</strong>, officier technique de la <strong>Garnison</strong> (Sergent-Major). D'une honnêteté maladive.</p>	\N	17	10	17	14	13	11	\N	57171985-dade-4fcc-a00b-c06de058c7d6	d280b9fb-1b1b-4bcd-9aa0-eaa43700a4fb	NAIN	MAN	MILITAIRE	{COMMUN,NAIN}	\N	f	15	65	f	4
2495d2ec-400b-43e6-a7bb-f465fe08d81d	Darven Krest	<p>Homme, 39 ans. Solide et carré, port militaire impeccable ; il garde les mains dans le dos et les pieds écartés, même au repos.</p>\n<p>Peau sombre, cheveux ras. Visage large, mâchoire nette, sans barbe. Yeux noirs, directs et impassibles. Une cicatrice courte au-dessus du sourcil droit.</p>\n<p><strong>Voix :</strong> forte et sèche, dressée au commandement en rue ; elle claque plus qu'elle ne porte. Débit bref, en ordres numérotés, aucune place pour la discussion. Ne dit jamais « je pense » : il dit « le règlement prévoit ».</p>\n<p><strong>Rôle :</strong> maintient l'ordre dans les quartiers populaires de <strong>Kalanos</strong>. Efficacité militaire et loyauté sans faille envers l'Empire.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	MAN	MILITAIRE	{}	\N	f	\N	\N	f	\N
d40200d5-8cd2-4fa9-adb2-1a97d9593965	Limor Kinemor	<p>Homme, 38 ans, membre de la famille royale <strong>Kinemor</strong>. Mince et nerveux, incapable de rester en place ; il arpente les pièces en parlant.</p>\n<p>Visage étroit et pâle, pommettes saillantes. Cheveux blond cendré coiffés en arrière. Yeux bleu pâle très mobiles. Une habitude de se ronger l'intérieur de la joue.</p>\n<p><strong>Voix :</strong> haute et rapide, avec l'accent pointu momoritanien poussé jusqu'à l'affectation. Débit précipité, il termine les phrases des autres et se corrige en cours de route. Baisse la voix par réflexe dès qu'il prononce un nom de la famille régnante, même en privé.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
d21e951b-fd8b-4c35-9e35-b3cddbbacd47	Velric Tovalis	<p>Homme humain, 20 ans, fils cadet <strong>Tovalis</strong>. Mince, d'allure juvénile, il ne ressemble pas encore à son père imposant. S'habille simplement — chemise ouverte, veste usée — mais porte des bijoux de pacotille en signe de rébellion discrète.</p>\n<p>Cheveux noirs en bataille, ombre de barbe irrégulière sur les joues. Yeux noirs vifs, regard souvent en dessous. Jointures récemment écorchées, bleu sur la pommette gauche.</p>\n<p><strong>Voix :</strong> jeune et cassante, qui monte trop vite dans l'aigu quand on le contredit. Débit précipité et agressif en public, où il en fait trop ; nettement plus posé et presque timide quand il n'y a qu'un interlocuteur. Ponctue ses phrases de « ouais, ouais » pour couper court aux conseils.</p>\n<p><strong>Rôle :</strong> rebelle, amateur de paris et de combats illégaux. Parfois aperçu au <strong>Goulet Écarlate</strong>.</p>\n<p><strong>Secret (MJ) :</strong> rumeur — il aurait des contacts dans <strong>La Braise</strong> pour du trafic de poudre de marbre (stimulant).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	{}	\N	f	11	24	f	1
e38ec34b-0893-4e6c-ad45-417865304a21	Nerios Vozin	<p>Homme humain, 51 ans. Grand et famélique, le dos creusé, les vêtements flottants de quelqu'un qui a beaucoup maigri récemment. Se tient près des sorties.</p>\n<p>Visage émacié, joues creuses, teint cireux. Cheveux bruns filasse coupés inégalement, sans doute par lui-même. Yeux noisette fiévreux, très cernés. Brûlures d'acide anciennes sur le dos des deux mains.</p>\n<p><strong>Voix :</strong> basse et rapide, hachée, comme s'il parlait toujours contre la montre. Débit haletant : il enchaîne les propositions sans respirer puis s'arrête net au milieu d'une phrase pour écouter la rue. Ne prononce plus le nom de <strong>Zenos Virion</strong> — il dit « l'autre », ou « celui d'avant ».</p>\n<p><strong>Rôle :</strong> alchimiste recherché, alias <strong>Zenos Virion</strong> — piste de cristomancie pour <strong>Elerÿna</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	\N	\N	f	\N
3b825d8b-5ddf-4e9f-8f6b-6e649330ee05	Lyrath Sorvane	<p>Homme elfe de l'aube, d'apparence centenaire — soit environ six cents ans réels. Il se déplace toujours lentement et délibérément. Sa robe officielle est blanche, avec des liserés dans les couleurs de chaque royaume signataire brodés sur les manches — un choix vestimentaire symbolique qu'il renouvelle lors de chaque nouveau traité. Autour du cou, le <strong>Médaillon des Ententes</strong> : une pièce en alliage de sept métaux différents, un par royaume fondateur.</p>\n<p>Peau d'un brun clair doré, cheveux blanc-argenté portés libres jusqu'aux épaules. Visage d'un homme dans la force de l'âge selon les standards elfiques : sans ride, mais avec dans les yeux — d'un vert forêt profond — une lassitude bienveillante accumulée sur des siècles de diplomatie.</p>\n<p><strong>Voix :</strong> douce et posée, conçue pour calmer — c'est un instrument de médiation avant d'être une voix. Débit très lent et parfaitement régulier, avec des silences qui obligent les parties à se calmer d'elles-mêmes. Il n'emploie jamais la première personne dans un arbitrage : il dit « le Palais constate », « il apparaît que ».</p>\n<p><strong>Rôle :</strong> Grand Médiateur du <strong>Palais des Ententes</strong>, plus haute autorité neutre de Huriya. Il ne prend jamais parti, n'exprime jamais d'opinion personnelle en public, et est réputé n'avoir jamais menti — ce qui, à son âge et à son poste, est soit un miracle, soit la preuve qu'il a simplement appris à ne jamais dire ce qu'il pense vraiment.</p>	\N	10	15	13	19	20	18	\N	57171985-dade-4fcc-a00b-c06de058c7d6	c529b485-e20b-41a9-9954-3058397c3c7d	ELFE	MAN	POLITIC	{COMMUN,ELFIQUE}	\N	f	13	52	f	4
05a5abd8-9df1-4c47-b688-aaff0a8054bb	"Le Voileur"	<p>Race, âge et carrure inconnus. Personne n'ayant survécu à une rencontre, on n'en tient que des silhouettes contradictoires : grand et sec pour les uns, court et large pour les autres. Les deux versions circulent aux Bas-Quais avec la même certitude.</p>\n<p>Visage jamais vu. Les rares témoins indirects parlent d'un voile sombre qui ne laisse rien passer, et de <strong>glyphes d'ombre</strong> qui courent sur la peau sous les vêtements, visibles une fraction de seconde quand il traverse une zone éclairée.</p>\n<p><strong>Voix :</strong> jamais entendue. Aucun témoignage ne rapporte qu'il ait parlé — ni avant, ni pendant, ni après. Ceux qui prétendent le contraire n'ont jamais pu s'accorder sur ce qu'il aurait dit.</p>\n<p><strong>Rôle :</strong> assassin fantôme du <strong>Syndicat d'Alagir</strong>. Tue sans jamais se montrer. Surnommé « <strong>Ombre de Sable</strong> » avec les autres assassins du Syndicat.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	OTHER	\N	\N	\N	\N	f	15	65	f	5
0ab73b36-d4bf-4d6d-9f91-79dcdb07fd05	Edran Voss	<p>Homme gnome, 62 ans. Petit et sec, perpétuellement penché en avant ; il travaille debout et se déplace en trottinant, sans jamais marcher vraiment.</p>\n<p>Crâne rasé, sourcils roux broussailleux, lunettes à triple lentille qu'il fait pivoter sans y penser. Tablier de cuir brûlé par endroits. <strong>Bras gauche automate</strong>, couvert de glyphes — animé par l'âme de son apprenti, mort dans une explosion.</p>\n<p><strong>Voix :</strong> haut perchée et nasillarde, débitée à une vitesse qui décourage l'interruption ; il finit les phrases des autres et enchaîne sur la sienne. Change de sujet en plein milieu et revient au premier trois minutes plus tard comme s'il ne l'avait jamais quitté. « <em>Non, pas ce flacon-là, il boude. Prenez celui qui tremble un peu, il aime les aventuriers.</em> »</p>\n<p>Certains soirs, le bras automate écrit seul, dans une langue oubliée.</p>\n<p><strong>Rôle :</strong> tient <strong>L'Œil d'Étain</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	442b74a9-f192-4061-be65-0229e70889e9	GNOME	MAN	\N	\N	\N	f	12	28	f	1
fd742210-154f-416b-ac2c-a158d6a35b23	Lyris Elvaltis	<p>Femme, 18 ans, fille cadette d'<strong>Aedran</strong>. Menue et un peu voûtée, toujours chargée : <strong>toujours entourée de parchemins</strong>, qu'elle porte en pile instable.</p>\n<p>Cheveux châtain clair, mal attachés, mèches devant les yeux. Visage jeune et fin, taches d'encre récurrentes. Yeux noisette attentifs derrière des besicles qu'elle remonte sans cesse.</p>\n<p><strong>Voix :</strong> claire et rapide, qui s'emballe dès qu'elle parle d'architecture ou d'histoire ancienne — elle devient alors difficile à suivre et s'en excuse trois phrases trop tard. Débit hésitant sur tout le reste, avec des « enfin, je veux dire » en cascade. Lit à mi-voix sans s'en apercevoir.</p>\n<p><strong>Rôle :</strong> fille cadette d'Aedran Elvaltis, à <strong>Kalanos</strong>. Érudite passionnée d'architecture et d'histoire ancienne.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
a831e174-ab51-47c3-92db-37b66cc35336	Ery Seel	<p>Homme humain, 39 ans. Petit et menu, épaules étroites, toujours penché sur un registre ; il se déplace le long des murs.</p>\n<p>Visage étroit et pâle, cheveux bruns plaqués avec soin. Yeux noirs vifs derrière des lunettes sans monture. Doigts tachés d'encre jusqu'à la deuxième phalange, ongles coupés au carré.</p>\n<p><strong>Voix :</strong> ténue et polie, à peine au-dessus du murmure — il faut souvent lui faire répéter, ce qu'il fait sans impatience. Débit précis et rapide sur les chiffres, hésitant dès qu'il s'agit d'une opinion. Termine ses phrases par « si je puis me permettre », même quand on ne lui demandait rien.</p>\n<p><strong>Rôle :</strong> greffier en chef de la <strong>Ligature Bancaire d'Alagir</strong>, bras droit de <strong>Lierin Lorial</strong>. Méticuleux et discret, il tient les registres officiels du cartel bancaire.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	11	22	f	2
1fe493d9-3fe2-47bf-bae2-376183eae589	Pellin Droun	<p>Homme humain, 46 ans. Épais et voûté, la carrure d'un ancien docker que le bureau a empâté sans l'affaiblir ; il garde les mains dans le dos en marchant sur les quais.</p>\n<p>Visage lourd et grêlé, nez épaté, cheveux noirs ras et clairsemés. Yeux marron mi-clos, qui ne regardent jamais un chargement en face mais ne ratent rien. Crochet de docker passé à la ceinture, dont il ne se sert plus.</p>\n<p><strong>Voix :</strong> rauque et basse, abîmée par vingt ans de cris sur les pontons ; elle ne remonte plus. Débit lent et las, comme si chaque phrase lui coûtait ; il laisse traîner la dernière syllabe. Ne dit jamais « interdit » : il dit « pas ce soir », et personne n'insiste.</p>\n<p><strong>Rôle :</strong> intendant du port pour le <strong>Syndicat d'Alagir</strong>. Ancien docker passé du côté obscur, il surveille les marchandises illégales. Aucun navire ne quitte Alagir la nuit sans son sceau secret.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	11	28	f	2
54f82a8e-b086-4414-bd1f-489455a0ad8f	Priel Vanguard	<p>Humain, nourrisson. Toujours emmitouflé dans des draps brodés aux armoiries Vanguard — pourpre et or.</p>\n<p>Joues rondes et roses ; yeux noisette déjà vifs et éveillés ; fines mèches de cheveux noirs qui commencent à boucler.</p>\n<p><strong>Voix :</strong> celle d'un nourrisson — gazouillis, rires en cascade, et des cris d'une puissance qui traverse trois salles du Château de Verre. Les nourrices notent une particularité dont personne ne parle : il se tait instantanément, et pour de bon, dès que son père entre dans la pièce.</p>\n<p><strong>Rôle :</strong> héritier royal d'Alagir, fils de <strong>Pelfort</strong> et <strong>Guetel Vanguard</strong>. Innocent, mais peut servir de levier émotionnel dans les intrigues du trône.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	{}	\N	f	\N	\N	f	\N
93fe4c22-d988-41c8-b440-6c4e0a805e14	Saphira Tel-Olem	<p>Femme humaine, 44 ans. Grande et mince, maintien rigide, mains gantées de cuir fin ; elle ne quitte jamais sa cape de voyage à l'intérieur.</p>\n<p>Visage allongé au teint mat, pommettes hautes. Cheveux noirs tirés en une tresse unique très serrée. Yeux noirs et fixes. Une cicatrice de brûlure en écaille sur le dos de la main droite, qu'elle laisse parfois voir volontairement.</p>\n<p><strong>Voix :</strong> grave et posée, avec une pointe d'accent du Levant sur les voyelles. Débit lent et mesuré, jamais pressé, même quand la salle l'est ; elle laisse un silence complet avant d'annoncer un taux. Ne répète jamais un chiffre : on note, ou on renonce.</p>\n<p><strong>Rôle :</strong> dragonnière et directrice de la <strong>Banque du Dragon d'Or</strong>. Spécialiste de l'escompte et des lettres de crédit à longue portée — routes de <strong>Huriya</strong> et des cités du Levant.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	\N	\N	f	12	35	f	3
11bbab3d-082b-4d21-99bc-2295684d1ee2	Prêtre déchu Voren Kahl	Prêtre déchu NM. CA 13 · PV 44. Infestation, Silence, Bannissement. Motiv : répandre la Désolation au nom de l'Œil Pourpre. Espère devenir un œil vivant du dieu.	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	\N	\N	\N	\N	f	13	44	f	4
9c4db771-dbb1-4418-8c62-9d2e81e2290f	Mada Rusk	<p>Femme humaine, 63 ans, trapue. Large et solidement plantée, avant-bras de rouleuse de tonneaux ; elle traverse sa salle en ligne droite et les clients s'écartent.</p>\n<p>Cheveux blancs tressés en deux nattes épaisses. Visage carré, tanné, sillonné de rides horizontales. Yeux gris délavés. Des <strong>tatouages de routes</strong> courent sur la peau des bras et du cou — chaque trait une étape qu'elle a faite.</p>\n<p><strong>Voix :</strong> une <strong>voix de cor de chasse</strong> — énorme, cuivrée, qui couvre la salle entière sans qu'elle force. Débit franc et direct, phrases courtes, aucun détour ; elle annonce l'addition du même ton qu'un départ de convoi. Rit d'un seul coup, très fort, puis s'arrête net.</p>\n<p><strong>Rôle :</strong> patronne et tenancière de <strong>La Roue de Secours</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	ab0c8d88-3f3b-41cc-809f-3cde159f2fad	HUMAIN	WOMAN	\N	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	12	30	f	1/2
522247e8-8a6e-4395-b4ad-f0048ea3a795	Boros Varn	<p>Homme demi-orc, 46 ans. Colossal et compact, le cou aussi large que la mâchoire ; il se tient parfaitement immobile quand il écoute, ce qui inquiète davantage que s'il bougeait.</p>\n<p>Peau vert sombre, crâne rasé, défenses inférieures intactes et jaunies. Nez plusieurs fois cassé, jamais remis. Yeux petits et noirs, sans curiosité. Une marque au fer sur la nuque — l'enclume du Conseil.</p>\n<p><strong>Voix :</strong> très grave, presque un raclement, qui sort sans que le visage bouge. Débit économe : il répond par trois mots là où deux suffiraient. Ne pose jamais de question. Répète mot pour mot l'ordre qu'on lui donne avant de l'exécuter, comme on scelle un contrat.</p>\n<p><strong>Rôle :</strong> commandant de terrain du <strong>Conseil d'Acier</strong>, loyal au-delà du raisonnable. Exécuteur principal des sentences du Conseil. Redoutable combattant, fanatiquement discipliné.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	d8ee7264-dfaa-4851-81dc-d94e529ad548	DEMI_ORC	MAN	\N	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	17	110	f	7
c904f8e1-61ae-4a23-9417-3d3af47a22ab	Dovren Sile	<p>Homme humain d'âge indéterminable — entre quarante et soixante-dix selon le jour. Grand et très mince, immobile, les mains jointes devant lui ; personne ne l'a jamais vu s'asseoir.</p>\n<p>Visage lisse et sans marque, traits réguliers qu'on oublie en sortant de la boutique. Cheveux argentés impeccablement coiffés. Costume noir sans le moindre ornement. Yeux dont aucun témoin ne s'accorde sur la couleur.</p>\n<p><strong>Voix :</strong> calme, presque inaudible — et pourtant elle résonne à l'intérieur du crâne plutôt qu'à l'oreille. Débit d'une lenteur absolue, sans respiration entre les phrases, sans jamais monter ni descendre. « <em>Les sons sont des dettes. Je préfère le silence des transactions parfaites.</em> »</p>\n<p><strong>Rôle :</strong> tient <strong>Le Cabinet du Silence</strong>.</p>\n<p><strong>Secret (MJ) :</strong> rumeur tenace — il serait une illusion consciente créée par le magasin lui-même.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	145ee62b-6bcb-49d2-b728-15f421f7782e	HUMAIN	MAN	\N	\N	\N	f	14	52	f	5
8526b213-2af7-4522-9da0-8ff499bd9cf5	Lirot	<p>Homme humain, 26 ans. Maigre et dégingandé, les épaules inégales à force de porter la canne de verrier du même côté.</p>\n<p>Visage jeune et creusé, joues rougies par la chaleur du four. Cheveux châtains collés au front. Yeux marron fatigués, sourcils et cils roussis. Doigts tachés de suie, brûlures anciennes sur le dos des mains.</p>\n<p><strong>Voix :</strong> voilée et un peu sifflante, abîmée par des années d'air chaud ; il tousse en fin de phrase. Débit timide et rapide, presque marmonné, comme s'il craignait de faire perdre du temps. S'excuse avant de servir, après avoir servi, et parfois entre les deux.</p>\n<p><strong>Rôle :</strong> souffleur de verre et serveur.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	11	20	f	1/4
7aeb95f1-d0ca-4772-8844-781dbfe61592	Maître Elar Vain	<p>Homme humain, 52 ans. Grand et très mince, d'une maigreur élégante ; il porte l'habit noir de service avec une raideur de soliste.</p>\n<p>Visage long et pâle, joues creuses, cheveux noirs plaqués en arrière et grisonnants aux tempes. Yeux sombres et cernés. Une marque rouge permanente sous la mâchoire gauche, à l'endroit du violon.</p>\n<p><strong>Voix :</strong> parlée, elle est terne et quasi inexistante — il répond par un murmure et préfère s'exprimer par l'archet. Débit minimal : « Monsieur », « Madame », « Tout de suite ». En revanche il fredonne en permanence, très bas, la ligne mélodique de ce qu'il jouera ensuite ; les habitués savent au fredonnement quel morceau vient.</p>\n<p><strong>Rôle :</strong> violoniste-serveur à <strong>La Verrière Fendue</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	55939ea9-a45e-42b4-8603-ded4f2701070	HUMAIN	MAN	\N	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	12	22	f	1/2
08c849e8-8e2c-47e0-a26d-764c484d897d	Sarlis Nym	<p>Gnome, 91 ans. Petit et rond, perché sur un tabouret à vis derrière un comptoir étroit ; travaille de nuit et dort le jour, ce qui se voit.</p>\n<p>Visage bouffi et pâle, cerné jusqu'aux pommettes. Cheveux blancs en couronne autour d'un crâne dégarni. Yeux verts extrêmement rapides, qui comptent les pièces avant que la main ne les pose. Une loupe d'horloger vissée en permanence à l'œil gauche.</p>\n<p><strong>Voix :</strong> nasillarde et feutrée, adaptée aux transactions qu'on ne veut pas voir répétées ; elle ne dépasse jamais la largeur du comptoir. Débit haché de chiffres, ponctué de petits claquements de langue à chaque conversion. Ne dit jamais le nom d'une devise étrangère à voix haute : il l'écrit à l'envers sur une ardoise et l'efface.</p>\n<p><strong>Rôle :</strong> cambiste nocturne, tient le <strong>Comptoir des Lunes</strong> — planque du <strong>Syndicat</strong>. Cartes nautiques vivantes en cave.</p>\n<p><em>Note MJ : son genre n'est pas établi en fiche — la description reste neutre.</em></p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	d32f0ae0-88a5-418b-b70f-6e3d56a633e0	GNOME	\N	\N	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	12	26	f	2
be422053-19d2-4236-bda9-702c8d9432ee	Lys Corven	<p>Femme humaine, ~35 ans. Sèche et souple, la carrure d'une éclaireuse ; elle se déplace sans bruit et se poste toujours là où la lumière ne va pas.</p>\n<p>Cheveux roux en tresse. Visage anguleux marqué de <strong>cicatrices fines</strong>. Yeux verts, extrêmement mobiles.</p>\n<p><strong>Voix :</strong> basse et brève, entraînée à ne pas porter au-delà de trois pas — réflexe d'éclaireuse qu'elle garde en salle de rapport. Débit rapide et dense, en informations compactées : direction, nombre, délai. Communique le plus souvent par gestes, et ne parle que si le geste ne suffit pas.</p>\n<p><strong>Rôle :</strong> sergent — « Maîtresse des Éclaireurs » de <strong>La Main du Silence</strong>.</p>\n<p><strong>Capacités notables :</strong> FP 5 · PV 68. Épée courte et arc court +7 ; attaque sournoise +3d6 ; camouflage naturel.</p>	\N	12	18	14	13	15	12	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	23641e11-f585-445d-9bac-5b3c4da603c8	HUMAIN	WOMAN	\N	\N	\N	f	16	68	f	5
3f56a62c-1102-4826-8c27-bc212a07db29	Maeltor Elvaltis	<p>Homme, 23 ans, fils aîné d'<strong>Aedran</strong>. Mince mais musclé, souple ; il s'assoit de travers et joue les nonchalants, mais ses mains sont couvertes d'éraflures de spéléologue.</p>\n<p>Visage anguleux, teint hâlé. Cheveux noirs coupés court, une mèche rebelle. <strong>Regard vif</strong>, yeux noirs qui détaillent tout en ayant l'air de ne rien regarder.</p>\n<p><strong>Voix :</strong> assurée et traînante, jouée sur un registre d'ennui poli qui ne le quitte jamais en public. Débit paresseux, ponctué de demi-sourires ; il répond à côté par principe. Le masque tombe quand on parle des <strong>ruines souterraines</strong> : la voix accélère et monte, et l'ambition affleure.</p>\n<p><strong>Rôle :</strong> fils aîné d'Aedran Elvaltis, à <strong>Kalanos</strong>. Désinvolture cachant une ambition féroce. S'aventure dans les ruines souterraines.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
34b88cc6-6e0c-4130-8737-8219793d7b20	Moite le juste	<p>Homme humain, 61 ans. De taille moyenne, sec, la mise sobre pour un souverain ; il porte les mêmes robes simples au conseil qu'en audience publique.</p>\n<p>Visage tanné et anguleux, barbe blanche taillée court. Cheveux gris sous un turban sans ornement. Yeux noirs très calmes, qui soutiennent sans défier. Mains sèches et croisées.</p>\n<p><strong>Voix :</strong> posée et grave, avec les intonations chantantes du Sandarane. Débit très lent, avec de longs silences avant chaque sentence — on dit qu'il compte jusqu'à sept avant de juger. Ne rend jamais un arrêt sans avoir répété à voix haute les arguments des deux parties.</p>\n<p><strong>Rôle :</strong> règne depuis <strong>Sandarane</strong>, la capitale. Siège au <strong>Cœur Vert</strong> du Sultanat.</p>	\N	10	10	10	10	10	10	\N	b35688a0-96ed-4416-82b9-19db566f7815	\N	HUMAIN	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
93239b41-8dee-4147-bc01-c5f2bdfd4614	Rany Mullimax	<p>Homme humain, 57 ans. Massif sans être gras, épaules de forgeron sous une redingote grise impeccable ; il se déplace lentement, comme s'il pesait chaque pas.</p>\n<p>Visage large et grêlé, mâchoire lourde, cheveux gris fer coupés ras. Yeux gris pâle qui ne cillent presque jamais.</p>\n<p><strong>Voix :</strong> basse et posée, qui ne monte jamais — c'est le silence qui suit qui fait peur. Débit régulier, sans une hésitation, avec des pauses placées là où d'autres mettraient une menace. Ne répète jamais une phrase : si on ne l'a pas entendue, c'est qu'on n'écoutait pas.</p>\n<p>Porte au pouce un anneau d'acier brut qu'il fait tourner en réfléchissant. Ne tend jamais la main le premier. Frappe trois fois du poing sur la table pour clore une discussion.</p>\n<p><strong>Rôle :</strong> chef de la cellule d'Alagir, dit « <strong>le Magistrat de Fer</strong> » parce qu'il rend ses arbitrages comme des sentences. Il ne négocie pas : il fixe des échéances. Dettes, marchés illégaux et mercenaires du quartier passent par lui.</p>\n<p><strong>Secret (MJ) :</strong> il a racheté sur ses fonds propres une part des créances Tovalis, à l'insu du Conseil international. Si l'affaire s'évente, c'est sa tête qui roule avant celle des Maisons.</p>	\N	15	12	16	16	15	17	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	e445a4a2-d1e3-4547-8dd7-4c9faf3e7463	HUMAIN	MAN	CRIMINALITE	{}	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	16	95	f	7
c9abd4d1-579f-4006-98d4-f49494a1c1b0	Wilherm Cadenet	<p>Homme humain, 63 ans. Petit et voûté, presque frêle, engoncé dans des lainages superposés — il a toujours froid dans les caves du Bastion Gris.</p>\n<p>Crâne dégarni tacheté, favoris blancs, lunettes à double foyer cerclées d'acier. Yeux myopes qui se plissent pour tout, doigts jaunis d'encre.</p>\n<p><strong>Voix :</strong> mince et chevrotante, souvent enrouée par le froid des caves ; il s'éclaircit la gorge entre deux phrases. Débit lent et monocorde, celui d'un homme qui lit à haute voix même quand il improvise — sauf sur les chiffres, qu'il énonce d'un trait, sans reprendre son souffle et sans se tromper. S'interrompt au milieu d'un mot dès qu'on ouvre une porte derrière lui.</p>\n<p>N'a pas quitté le Bastion Gris depuis onze ans. Récite les montants de mémoire avant de vérifier, et ne se trompe pas. Appelle chaque débiteur par son numéro de folio, jamais par son nom.</p>\n<p><strong>Rôle :</strong> gardien du <strong>Grand Registre</strong>, où sont consignées toutes les créances du Conseil sur Alagir. Les trois grandes Maisons y figurent : <strong>Tovalis</strong> la plus lourde (avances sur l'exploitation des carrières), <strong>Cilovard</strong> une dette moyenne contractée pour couvrir un revers maritime, <strong>Palhindile</strong> la plus petite mais la plus honteuse — empruntée en secret par un proche de la Chancelière.</p>\n<p><strong>Secret (MJ) :</strong> deux folios ont été arrachés du Registre. Il sait qui les a pris et se tait — parce que cette personne paie pour son silence.</p>	\N	8	10	11	18	16	11	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	e445a4a2-d1e3-4547-8dd7-4c9faf3e7463	HUMAIN	MAN	CRIMINALITE	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	12	38	f	2
dc878db9-301f-4fbc-b3bb-63298432df54	Guetel Vanguard	<p>Femme humaine, la trentaine, belle et soignée avec l'application d'une ambassadrice. Silhouette élancée, maintien de cour irréprochable ; robes impeccables, bijoux choisis pour signifier sans éblouir.</p>\n<p>Cheveux châtain doré toujours relevés en couronne élaborée ; yeux gris-vert au regard impénétrable derrière un sourire diplomatique parfaitement maîtrisé ; traits délicats, teint pâle légèrement fardé.</p>\n<p><strong>Voix :</strong> mélodieuse et posée, d'une amabilité si constante qu'elle en devient illisible — rien dans le timbre ne distingue un compliment d'un refus. Débit fluide, jamais pris en défaut, avec le léger allongement des fins de phrase qu'on apprend dans les cours étrangères. Change imperceptiblement d'accent selon l'ambassadeur qu'elle reçoit.</p>\n<p><strong>Rôle :</strong> épouse du roi <strong>Pelfort Vanguard</strong>, reine d'Alagir. Complice de Pelfort ; ambassadrice auprès des Duchés des Dolomites.</p>\n<p><strong>Secret (MJ) :</strong> canal de messagerie chiffrée avec <strong>Huriya</strong> ; rumeur d'un ancien lien avec le <strong>Syndicat</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
5caf0606-7c80-4c4b-8560-5dd138500a7d	Nyssara Elvaltis	<p>Femme, 42 ans. Élégante et mesurée, silhouette souple ; elle touche volontiers le bras de ses interlocuteurs, et ceux-ci s'en souviennent.</p>\n<p><strong>Cheveux auburn</strong> relevés en couronne tressée. Visage régulier au teint clair, sourire chaleureux et constant. Yeux noisette attentifs, qui s'attardent un instant de trop. Médaillon de <strong>Ral Nagor</strong> au cou.</p>\n<p><strong>Voix :</strong> chaude et enveloppante, avec la cadence apaisante des officiants. Débit lent et bienveillant, riche en formules de sollicitude derrière lesquelles se glissent des questions très précises. Termine ses phrases par « n'est-ce pas ? », qui obtient presque toujours un acquiescement dont on ne mesure pas la portée.</p>\n<p><strong>Rôle :</strong> gère les affaires sociales et religieuses de <strong>Kalanos</strong>. Dévouée à <strong>Ral Nagor</strong>. Manipulatrice habile dans les cercles influents.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	WOMAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
38b3360c-8a20-408c-ada3-195cbb1fe0eb	Miravosk	<p>Homme nain, 142 ans. Large et voûté, la carrure encore là sous le laisser-aller ; il porte son ventre comme un homme qui fut costaud et a cessé de s'en soucier. Démarche lente, une main toujours prête à trouver un appui.</p>\n<p>Visage buriné, joues et nez marbrés de couperose. Barbe grise mal égalisée, autrefois tressée — on devine encore le pli des anneaux qu'il n'y met plus. Yeux gris pâle bordés de rouge, qui se réveillent d'un coup dès qu'on parle chiffres, fournisseurs ou fûts. Sourcils épais, front barré de rides horizontales.</p>\n<p><strong>Voix :</strong> grave et rocailleuse, usée par la fumée et le mauvais vin ; elle part dans les aigus quand il s'emporte, ce qui ne lui arrive presque jamais. Débit pâteux le matin, de plus en plus fluide à mesure que la journée avance. Ponctue ses phrases d'un « voilà » qui ne conclut rien. Ne prononce jamais le prénom de sa femme à voix haute : il dit « elle », et toute la maison a compris.</p>\n<p>Il n'occupe jamais la table du fond, à gauche de l'âtre : c'est là qu'il l'a rencontrée. Il l'essuie chaque matin et n'y laisse asseoir personne. Tutoie tout le monde à partir du deuxième verre. Sait au litre près ce qui reste en cave sans avoir jamais rien noté.</p>\n<p><strong>Rôle :</strong> <strong>tonnelier</strong> de son état, membre de la <strong>Guilde du Marteau Blanc</strong> — trente ans à monter et livrer des fûts dans tout Alagir, des brasseries des Bas-Quais jusqu'aux <strong>Verreries Royales</strong>, qui en achètent par douzaines pour le sable, la cendre et la soude. Il n'a <em>jamais</em> travaillé à <strong>La Loutre SAOUL</strong> : il y buvait. C'est là qu'il a rencontré sa femme, un soir de livraison. Après leur mort, il n'a plus quitté la maison — partir, ce serait la laisser — et il y est resté quand elle est tombée en ruine ; c'est là que les PJ l'ont trouvé, en train de cuver. Il en est aujourd'hui l'<strong>homme de confiance et l'administrateur</strong> : commandes, fournisseurs, gages, comptes et embauches passent par lui — c'est lui qui a engagé <strong>Sabine Quenot</strong>. Trente ans de tournées lui ont appris qui livre honnêtement, qui coupe son vin, et ce que chaque chose doit coûter.</p>\n<p><strong>Secret (MJ) :</strong> sa femme <strong>Nerika</strong> soufflait le verre aux <strong>Verreries Royales</strong> ; leur fille <strong>Vilda</strong> a grandi dans l'air du Château de Verre et n'a pas vu ses dix ans. Elles sont mortes le même hiver de ce qu'on appelle en contrebas la « <strong>toux du verre</strong> » — celle qui prend les souffleurs et les rues sous le vent des évents. Les <strong>Palhindile</strong> ont payé les enterrements, comme ils le font toujours, et n'ont rien changé : les fours et les formules ont des siècles, les évents avec. Il y a vingt ans, Miravosk a déposé à la Chancellerie une requête demandant qu'on déplace ces évents ; elle a été enregistrée et jamais traitée — elle dort encore au <strong>Dépôt des Serments Inachevés</strong>, sous le nom de Nerika. Il garde en cave ses propres livres de livraison de ces années-là : les fours ont tourné plus fort trois hivers de suite, exactement quand la toux a commencé en bas. Cela prouve une coïncidence, pas un crime, et il sait ce qu'une grande maison fait d'un artisan des quais qui confond les deux. Il n'en a jamais parlé à personne. Mais si les Palhindile se mettaient publiquement à répondre de ce qu'ils font — ce que la proposition d'abolition laisserait croire — il sortirait tout.</p>\n<p><strong>Capacités notables :</strong> aucun talent martial — il n'a plus levé autre chose qu'un tonneau depuis trente ans. En revanche, mémoire absolue des visages et des ardoises : il reconnaît un client vu une seule fois trente ans plus tôt, et se souvient de ce qu'il devait.</p>	\N	13	9	15	13	14	12	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	57210a91-4e46-40ee-9e76-a6abd07189b1	NAIN	MAN	MARCHAND	{COMMUN,NAIN}	cd218e67-1630-4948-a3e2-585a884aee96	f	11	26	f	1/4
a84f9bb6-0ea1-4026-968b-6e7738498699	Hulda Brasefer	<p>Femme naine, 118 ans. Charpentée, avant-bras énormes constellés de brûlures anciennes ; elle se tient jambes écartées, comme prête à encaisser un coup.</p>\n<p>Visage rougeaud et carré, sourcils roux broussailleux, tresse grise nouée de fil d'acier. Un œil laiteux, brûlé par une projection de métal.</p>\n<p><strong>Voix :</strong> énorme, faite pour couvrir un marteau sur l'enclume, et elle ne la baisse pour personne. Rit au milieu de ses propres phrases, souvent avant la fin. Roule les « r » à la manière des vieux clans et sème dans le commun des jurons nains que personne ne lui traduit. Devient très basse et très lente quand elle parle de ses armes — c'est le seul moment où on l'écoute vraiment.</p>\n<p>Rit fort et souvent, y compris aux mauvaises nouvelles. Goûte le métal du bout de la langue pour en juger. Refuse de forger après minuit, et ne s'en explique jamais.</p>\n<p><strong>Rôle :</strong> tient la forge du <strong>Marteau Courtois</strong>. Officiellement outillage et ferrures ; en pratique, armes de contrebande et pièces impossibles à tracer. Gardienne du marteau sacré — trois coups sur l'enclume lient un serment pour trente jours.</p>\n<p><strong>Secret (MJ) :</strong> c'est elle qui garde le coffre d'« armes vivantes » dont bruisse le quartier. Elle refuse de les vendre : elle les a forgées, et elle sait ce qu'elles réclament en retour.</p>	\N	18	11	17	12	14	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	d8ee7264-dfaa-4851-81dc-d94e529ad548	NAIN	WOMAN	CRIMINALITE	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	16	75	f	4
8dfca091-e7fd-492a-9e80-3cb51d173580	Orane Ferrand	<p>Femme humaine, 32 ans. Mince et rapide, toujours en tenue de route ; elle se déplace comme quelqu'un qui a un chariot à rattraper.</p>\n<p>Cheveux châtains coupés à la nuque, visage anguleux et hâlé, yeux verts cernés d'une fatigue chronique.</p>\n<p><strong>Voix :</strong> haut perchée et rapide, un peu essoufflée, comme si elle parlait en marchant — ce qui est souvent le cas. Débit en avalanche : elle entame trois idées avant d'en finir une, coupe la parole sans s'en apercevoir et s'en excuse toujours après coup. Baisse d'un ton et ralentit brutalement quand elle ment.</p>\n<p>Mâche des graines de fenouil pour tenir éveillée. Note tout sur son avant-bras au crayon gras. Connaît par cœur les horaires des rondes.</p>\n<p><strong>Rôle :</strong> elle règle les convois nocturnes qui transitent par les <strong>Entrepôts du Pourpre</strong>. Le Conseil prend sa part sur tout ce qui bouge — y compris sur les « chargements » de la filière d'esclaves des Mastiggia.</p>\n<p><strong>Secret (MJ) :</strong> elle vend en douce les horaires du Conseil à l'Œil Pourpre. Pas pour l'argent : l'Œil Pourpre tient son frère.</p>	\N	11	16	13	14	13	13	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	c79aa2b9-2f0a-4aca-a7a2-e8f3a301c6d7	HUMAIN	WOMAN	CRIMINALITE	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	14	48	f	3
8c2eeaa5-9a2f-4d9f-8fa6-014fa6a70c0b	Folduin Xyrlana (mort)	<p>Homme humain, la cinquantaine, au teint olivâtre. De corpulence moyenne, un peu tassé, le pourpoint or et noir toujours impeccablement boutonné jusqu'au col.</p>\n<p>Mâchoire carrée, front dégarni qu'une calotte noire dissimulait avec peu de succès ; yeux bruns profonds enfoncés sous des sourcils broussailleux ; petite bouche habituellement pincée en une ligne prudente.</p>\n<p><strong>Voix :</strong> nasillarde et prudente, toujours un demi-ton trop bas, comme s'il craignait d'être entendu d'à côté — ce qui était le cas. Débit haché, plein de conditionnels et de formules de réserve ; il ne terminait jamais une phrase engageante. Répétait « bien entendu, bien entendu » en cherchant une échappatoire.</p>\n<p><strong>Rôle :</strong> clerc de <strong>Zitris</strong> et usurier, échoppe de la Porte Pourpre. Devait 300 po à <strong>Laguna</strong>. Liens <strong>Cilovard</strong> et <strong>Palhindile</strong>. <em>Décédé.</em></p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	c3f61c29-3710-4502-89da-263ea482fd57	HUMAIN	MAN	\N	{}	\N	f	\N	\N	f	\N
ac6c4a4a-5f2c-4a4c-b2a9-357ac2923860	Marcheto Spazi	<p>Homme humain, 45 ans, sculpteur dolomitcien. Solide et large de mains, épaules inégales à force de frapper du même côté ; poussière de marbre incrustée jusque dans les plis du cou.</p>\n<p>Visage carré, barbe noire courte et mal égalisée, cheveux bouclés poivre et sel attachés en catogan. Yeux noirs très mobiles, qui détaillent les visages comme s'il cherchait le bloc dedans. Ongles cassés, paumes blanches de poudre.</p>\n<p><strong>Voix :</strong> sonore et généreuse, avec un accent dolomitcien chantant qu'il ne modère pas dans les salons. Débit passionné et coupé de gestes ; il se lève pour expliquer. Baisse d'un coup à un murmure pour parler prix, et sourit en le faisant.</p>\n<p><strong>Rôle :</strong> présent à la soirée mondaine chez <strong>Regalio Regani</strong> — quête d'infiltration de <strong>Harl Denvar</strong> (Partie 5).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	\N	\N	f	\N
8e568e50-446f-4ccf-ad74-ba8fade07a59	Maela Varek	<p>Femme humaine, 54 ans, épouse d'<strong>Odran</strong>. Grande et droite, d'une <strong>grande beauté malgré l'âge</strong> ; elle traverse le hameau sans presser le pas.</p>\n<p>Cheveux gris argent relevés en chignon. Visage aux traits fins conservés, peau claire finement ridée. <strong>Yeux verts perçants</strong>, qui ne lâchent pas un interlocuteur.</p>\n<p><strong>Voix :</strong> posée et un peu basse, d'une douceur qui n'a rien de tendre. Débit lent, avec l'habitude de laisser un silence après une réponse qui l'a mécontentée — et c'est là que les gens se reprennent tout seuls. Elle <strong>repère immédiatement les mensonges</strong>, et le signale d'un seul mot : « Encore ? »</p>\n<p><strong>Rôle :</strong> épouse d'Odran Varek, au <strong>Hameau de Valbrume</strong>.</p>	\N	10	11	12	13	15	14	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	e2a6f6fd-8b5a-49cf-8404-1b854a51acbb	HUMAIN	WOMAN	\N	\N	\N	f	11	18	f	1/4
f77d9ba9-30c8-4d94-b0c1-89420f643296	Lady Velena Cilovard	<p>Femme humaine, 55 ans, épouse de <strong>Garran Cilovard</strong>. Élancée, silhouette soignée, qui porte ses années avec une grâce distillée. Gestes lents et assurés ; robes de soie sobre, jamais criardes, toujours de qualité irréprochable.</p>\n<p>Cheveux auburn soigneusement relevés en chignon, striés de fils blancs qui ressemblent à un choix esthétique plutôt qu'à un signe de l'âge. Yeux verts au regard doux et calculateur, fines rides aux commissures qui apparaissent lorsqu'elle sourit — ce qui est fréquent. Peau pâle.</p>\n<p><strong>Voix :</strong> douce et enveloppante, d'une bienveillance parfaitement jouée ; elle demande des nouvelles de vos enfants par leur prénom. Débit lent et soigné, avec un petit rire de gorge placé avant les demandes, qui les fait passer pour des faveurs qu'on lui rend. Ne formule jamais une exigence : elle exprime une inquiétude.</p>\n<p><strong>Rôle :</strong> dirige la <strong>Caisse des Richesses Cachées</strong>. Fine manipulatrice, elle crée des dettes morales sous couvert de générosité.</p>\n<p><strong>Secret (MJ) :</strong> certains de ses registres s'écrivent seuls, en encre rouge vive.</p>\n<p><strong>Capacités notables :</strong> CA 14 · PV 54 · Stylet +5. Charme du serpent (avantage en Tromperie contre nobles et prêtres) ; Comptabilité sacrée 1/jour (Détection de la magie).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	{}	\N	f	14	54	f	5
9a7b6933-5dc5-4e0b-87a1-cf3ac490f268	Dorian Hale	<p>Homme humain, 46 ans. Grand et sec, très droit ; le manteau noir d'inquisiteur tombe sans un pli, et il ne s'assoit qu'après y avoir été invité deux fois.</p>\n<p>Chauve, le crâne pâle et net. Traits sévères, joues creuses, lèvres minces. <strong>Yeux bleu pâle</strong>, fixes, qui ne cillent presque pas.</p>\n<p><strong>Voix :</strong> claire et froide, d'une neutralité d'interrogatoire ; elle ne change pas qu'il salue ou qu'il accuse. Débit lent et méthodique, avec une pause après chaque question — toujours plus longue que nécessaire, pour laisser le silence travailler. Répète votre réponse mot pour mot avant de passer à la suivante.</p>\n<p><strong>Rôle :</strong> Frère Dorian Hale, agent inquisitorial de <strong>La Main du Silence</strong>.</p>\n<p><strong>Capacités notables :</strong> FP 5 · PV 72. Sorts DD 14 : thaumaturgie, guidance ; zone de vérité, détection des pensées ; suggestion 1/jour.</p>	\N	11	14	14	15	17	16	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	23641e11-f585-445d-9bac-5b3c4da603c8	HUMAIN	MAN	\N	\N	\N	f	15	72	f	5
636aae36-ee4c-4d40-aa22-95409a1f732d	Elira Varek	<p>Femme humaine, 22 ans, fille cadette. Mince et vive, encore un peu gauche ; elle se déplace par à-coups, s'arrête net quand quelque chose l'intrigue.</p>\n<p>Cheveux noirs très longs, souvent mal attachés. Yeux noisette grands et mobiles. Visage fin, encore juvénile, une tache d'encre fréquente sur la joue.</p>\n<p><strong>Voix :</strong> claire et rapide, qui monte quand elle s'enthousiasme — c'est-à-dire souvent. Débit en avalanche de questions : elle en pose trois avant d'écouter la réponse à la première, et revient ensuite à chacune dans l'ordre. Baisse la voix et articule lentement quand elle a compris quelque chose que les adultes n'ont pas.</p>\n<p><strong>Rôle :</strong> fille cadette de la <strong>Famille Varek</strong>, au <strong>Hameau de Valbrume</strong>. Intelligence et curiosité remarquées.</p>	\N	9	12	11	15	13	14	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	e2a6f6fd-8b5a-49cf-8404-1b854a51acbb	HUMAIN	WOMAN	\N	\N	\N	f	11	16	f	1/4
6951831e-2bb4-40e2-9ecc-bc3cacde1eb4	Garrik Varek	<p>Homme humain, 30 ans, fils aîné. Immense gaillard, épaules larges, tablier de cuir ; il se baisse par réflexe sous les portes du hameau.</p>\n<p>Cheveux châtains courts. Visage large et franc, hâlé, barbe de quelques jours. Yeux noisette calmes. Mains énormes, brûlées par la forge aux doigts.</p>\n<p><strong>Voix :</strong> grave et lente, avec un fond de timidité qui surprend chez un homme de cette taille. Débit hésitant en société, franchement volubile au travail, où il commente chaque geste à voix haute. Rit d'un rire énorme, qu'il coupe net en se rappelant qu'on l'écoute.</p>\n<p><strong>Rôle :</strong> fils aîné de la <strong>Famille Varek</strong>, au <strong>Hameau de Valbrume</strong>.</p>	\N	16	11	15	10	12	12	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	e2a6f6fd-8b5a-49cf-8404-1b854a51acbb	HUMAIN	MAN	\N	\N	\N	f	13	38	f	2
6770be44-0782-4653-980a-925ff9676607	Soldat type — Main du Silence	Archétype soldat de la garnison (~18 effectifs). CA 15, PV 27, FP 1. Épée courte +4, arbalète légère +4. Formation silencieuse, discipline absolue.	\N	13	14	12	11	12	10	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	23641e11-f585-445d-9bac-5b3c4da603c8	HUMAIN	\N	\N	\N	\N	f	15	27	f	1
110efc91-cda4-49e9-8633-f1c68bb51010	Éclaireur type — Main du Silence	Archétype éclaireur (~4 effectifs). Arc court +5, dague +5 ; attaque sournoise +2d6, camouflage.	\N	11	16	12	12	14	11	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	23641e11-f585-445d-9bac-5b3c4da603c8	HUMAIN	\N	\N	\N	\N	f	15	32	f	2
c5b0da05-e204-4613-9e64-cf5aad95f53b	Vétéran type — Main du Silence	Archétype vétéran (~2 effectifs). Multiattaque, épée longue +6, arbalète lourde +6. Indomptable 1/j, gardien du secret.	\N	16	15	16	12	14	12	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	23641e11-f585-445d-9bac-5b3c4da603c8	HUMAIN	\N	\N	\N	\N	f	17	58	f	4
e4a4f098-636f-4886-9888-e4292ad62361	Odon Pince	<p>Homme demi-orc, 41 ans. Trapu et large, cou épais, mains disproportionnées ; il occupe un pas de porte sans avoir besoin de le bloquer.</p>\n<p>Crâne rasé, arcade fendue mal recousue, petites défenses inférieures limées à ras. Yeux marron étonnamment doux, qui donnent envie de le croire.</p>\n<p><strong>Voix :</strong> grave et douce, étonnamment posée pour sa carrure — il parle comme on s'excuse, et c'est précisément ce qui met mal à l'aise. Débit lent, phrases courtes, beaucoup de « vous » et de formules apprises. Ne hausse jamais le ton : quand ça se gâte, il parle plus bas et plus lentement encore.</p>\n<p>Frappe trois fois le comptoir avant de parler — d'où son surnom de « <strong>Trois-Coups</strong> ». S'excuse toujours du dérangement. Caresse le bois des meubles comme s'il les évaluait.</p>\n<p><strong>Rôle :</strong> collecteur des Bas-Quais. C'est lui qui vient à <strong>La Loutre SAOUL</strong> réclamer la « contribution à la tranquillité » : <strong>25 po par mois</strong>, doublée au deuxième retard, et « on ne répond plus de rien » au troisième. Il prévient une fois. Une seule.</p>\n<p><strong>Secret (MJ) :</strong> il déteste ce travail et arrondit les échéances à la baisse quand personne ne vérifie. Un établissement qui le traite en homme plutôt qu'en menace peut en faire un informateur — mais Tessa Kaorn le soupçonne déjà.</p>	\N	17	12	16	10	12	12	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	57210a91-4e46-40ee-9e76-a6abd07189b1	DEMI_ORC	MAN	CRIMINALITE	{}	\N	f	15	60	f	3
385cd5b3-4dc9-4215-9bc5-56d3f3de8aa7	Grazh	<p>Homme demi-orc, 38 ans. Immense et lourd, des épaules qui obligent à se mettre de biais pour passer la porte à côté de lui ; il ne bouge pas beaucoup, et c'est précisément l'effet recherché.</p>\n<p>Peau gris-vert, crâne rasé couvert de cicatrices fines et régulières — des marques faites une par une, pas au combat. Mâchoire lourde, canines inférieures limées à ras. Yeux petits et noirs, très calmes. Une cicatrice pâle lui barre la gorge sous le menton.</p>\n<p><strong>Voix :</strong> aucune — on lui a coupé la langue. Il ne produit que des sons de gorge : un grondement bas et long pour l'assentiment, deux notes brèves pour le refus, un souffle par le nez quand quelque chose l'amuse. Il comprend parfaitement le commun et l'orc mais ne lit ni n'écrit ; il s'exprime par gestes et en frappant du plat de la main sur le chambranle — un coup pour « entre », deux pour « dehors ». <strong>Miravosk</strong> est le seul à le comprendre couramment. Salue les habitués d'un hochement, et regarde les inconnus jusqu'à ce qu'ils détournent les yeux.</p>\n<p><strong>Rôle :</strong> portier et videur de <strong>La Loutre SAOUL</strong>. <strong>Miravosk</strong> l'a pris sous son aile des années plus tôt — il portait les fûts sur les tournées du vieux tonnelier ; quand celui-ci s'est enfermé dans la Loutre, il l'a suivi et n'en est pas reparti. Il a gardé une porte qui ne menait plus nulle part, jusqu'à ce que les PJ la rouvrent. Il connaît chaque visage passé par cette porte, et n'a jamais laissé entrer deux fois quelqu'un qui s'était mal conduit.</p>\n<p><strong>Secret (MJ) :</strong> on lui a coupé la langue pour qu'il ne puisse jamais nommer les acheteurs. Vendu enfant, puis revendu plusieurs fois avant de s'échapper, il se souvient de tous les visages. Le soir de la réouverture de la Loutre, il en a reconnu un parmi les invités et a tenté de le signaler à Miravosk — qui avait trop bu. Il attend depuis. Ne sachant ni lire ni écrire, il ne pourra le dire qu'à qui prendra le temps de le comprendre, ou à qui saura le faire parler autrement.</p>\n<p><strong>Capacités notables :</strong> costaud et endurant, il encaisse plus qu'il ne frappe. Ne dégaine jamais d'arme : il sort les gens à bras-le-corps.</p>	\N	17	12	16	9	12	8	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	57210a91-4e46-40ee-9e76-a6abd07189b1	DEMI_ORC	MAN	OTHER	{COMMUN,ORC}	cd218e67-1630-4948-a3e2-585a884aee96	f	14	52	f	2
290b1fc7-4fa4-4591-a2e9-bea0cb0e6a5b	Deux Nuits	<p>Homme goliath, massif. Une odeur d'ozone et de cendre froide l'entoure après chaque incantation.</p>\n<p>Peau grise striée de veines noires comme de la fumée figée. Barbe tressée de cordes de cuir, anneaux d'os aux poignets.</p>\n<p><strong>Voix :</strong> caverneuse et profonde, avec une résonance métallique qui s'installe dans la pièce quelques secondes après qu'il a cessé de parler. Débit lourd et scandé, presque liturgique ; il détache les syllabes des noms qu'il invoque. Quand il conjure, la voix se dédouble brièvement — un ton plus bas par-dessous.</p>\n<p><strong>Rôle :</strong> maître conjurateur du <strong>Monastère des Nuits</strong>. École : <strong>Conjuration</strong>. Appelle créatures et objets d'autres plans.</p>\n<p><strong>Capacités notables :</strong> FP 4 · PV 48. Sorts signatures : Invoquer des animaux, Nuage nauséabond, Porte dimensionnelle. « Appel du seuil » : invoque 1 élémentaire mineur obéissant 1 h (1/jour).</p>	\N	14	10	16	18	11	13	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	GOLIATH	MAN	\N	\N	\N	f	13	48	f	4
52ab9bce-74dd-49b3-85c1-d519c83340f3	Odran Varek	<p>Homme humain, 58 ans, patriarche et chef du hameau. Dos légèrement voûté, mains cicatrisées. Tunique de laine brune, manteau de voyage, médaillon de <strong>Tal Alion</strong>.</p>\n<p>Visage buriné, barbe grisonnante. Rides profondes au coin des yeux, de celles qu'on prend à scruter l'horizon et les gens.</p>\n<p><strong>Voix :</strong> grave et un peu usée, sans autorité affichée — il ne hausse jamais le ton, et le hameau l'écoute quand même. Débit très lent, avec de longues pauses pendant lesquelles il réfléchit vraiment ; il laisse chacun aller au bout avant de répondre. Rend ses jugements en commençant toujours par « Voilà ce que j'ai compris », puis résume les deux versions avant de trancher.</p>\n<p><strong>Rôle :</strong> patriarche et chef du <strong>Hameau de Valbrume</strong>. Pragmatique, protecteur, patient ; juge local des conflits mineurs.</p>	\N	14	10	13	11	14	15	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	e2a6f6fd-8b5a-49cf-8404-1b854a51acbb	HUMAIN	MAN	\N	\N	\N	f	12	27	f	1
2237610a-899b-4f8b-8c6c-0ad0b7f50fba	Une Nuit	<p>Femme goliathe, trapue. Robe de laine noire bordée de fil d'argent, gantelet de pierre gravé de glyphes protecteurs.</p>\n<p>Stries d'ardoise bleutée sur les bras et les joues ; cheveux rasés en crête ; yeux laiteux sans pupille visible.</p>\n<p><strong>Voix :</strong> grave et nette, avec une netteté d'articulation qui rappelle la formule plus que la conversation. Débit régulier et sans ornement, elle énonce ses conditions avant ses réponses. Quand elle contre un sort, le mot qu'elle prononce sonne une demi-seconde après que l'effet s'est produit.</p>\n<p><strong>Rôle :</strong> maîtresse abjuratrice du <strong>Monastère des Nuits</strong>. École : <strong>Abjuration</strong>. Tisse et défait les barrières magiques.</p>\n<p><strong>Capacités notables :</strong> FP 4 · PV 52. Sorts signatures : Bouclier, Contresort, Protection contre les armes, Globe d'invulnérabilité (1/jour). Réaction « Mur de runes » : annule un sort ciblant un allié à 9 m (recharge après un repos court).</p>	\N	14	10	16	17	16	12	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	GOLIATH	WOMAN	\N	\N	\N	f	14	52	f	4
b5122e37-4f00-4169-8d83-031c7d3981f5	Cinq Nuits	<p>Femme goliathe, imposante. Haute et charpentée, elle domine l'assemblée du Monastère — et pourtant <strong>ses pas ne font presque aucun bruit</strong>.</p>\n<p>Peau striée de noir et blanc en damier — on jurerait que le motif change quand on détourne le regard. Cheveux longs tressés de rubans de soie sombre. Sourire rare et déroutant.</p>\n<p><strong>Voix :</strong> grave et veloutée, avec une particularité que ses élèves redoutent : elle semble venir d'un autre endroit de la pièce que celui où elle se tient, et l'on se retourne. Débit lent et suspendu, avec des silences pendant lesquels on n'est plus certain qu'elle ait parlé. Ne dit jamais deux fois la même phrase de la même manière.</p>\n<p><strong>Rôle :</strong> maîtresse illusionniste du <strong>Monastère des Nuits</strong>. École : <strong>Illusion</strong>. Tisse mirages et mensonges sensoriels.</p>\n<p><strong>Capacités notables :</strong> FP 6 · PV 58. Sorts signatures : Image silencieuse, Image majeure, Invisibilité, Mirage. « Manteau des mille reflets » : copie illusoire d'elle-même qui peut agir 1 round (recharge 5-6). Avantage aux JS pour dissiper ses illusions.</p>	\N	14	10	16	18	14	17	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	GOLIATH	WOMAN	\N	\N	\N	f	14	58	f	6
b9fdbf2d-b7cb-4baa-b60b-eaf54dbd8865	Six Nuits	<p>Homme goliath, cagneux. Mains toujours chaudes ; l'air tremble légèrement à ses côtés.</p>\n<p>Stries rouges comme des coulées de lave sur la pierre grise de sa peau. Crâne partiellement rasé, cicatrices de brûlures anciennes.</p>\n<p><strong>Voix :</strong> claquante et sèche, avec un grain de braise qui craque ; elle porte très loin et fait sursauter dans un couloir. Débit brusque, par salves courtes, avec des montées de volume imprévisibles. Quand il incante, chaque syllabe s'accompagne d'un souffle d'air chaud que l'on sent à trois pas.</p>\n<p><strong>Rôle :</strong> maître évocateur du <strong>Monastère des Nuits</strong>. École : <strong>Évocation</strong>. Déchaîne feu, foudre et force brute.</p>\n<p><strong>Capacités notables :</strong> FP 5 · PV 55. Sorts signatures : Boule de feu, Éclair, Mur de feu. « Frappe tellurique » : ligne de 18 m, 6d6 dégâts de force (JS Dextérité pour moitié, recharge 5-6). Résistance aux dégâts de feu et de foudre.</p>	\N	14	10	16	16	12	11	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	GOLIATH	MAN	\N	\N	\N	f	13	55	f	5
5292d7d4-ab2e-4ddf-83a0-6aa4f78ce713	Huit Nuits	<p>Homme goliath au visage ascétique. Sec et long, immobile ; le froid s'attarde autour de ses mains et les flammes vacillent en sa présence.</p>\n<p>Peau gris cendre striée de veines noires. Crâne rasé, tatouages funéraires sur le cuir chevelu.</p>\n<p><strong>Voix :</strong> rauque et basse, presque soufflée, comme si l'air lui manquait toujours un peu. Débit lent et détaché, d'un calme absolu quel que soit le sujet. Une particularité que ses élèves redoutent : quand il prononce un nom de mort, un très léger écho la double, d'un demi-temps en retard.</p>\n<p><strong>Rôle :</strong> maître nécromancien du <strong>Monastère des Nuits</strong>. École : <strong>Nécromancie</strong>. Dialogue avec la mort et les ombres.</p>\n<p><strong>Capacités notables :</strong> FP 5 · PV 72. Sorts signatures : Animation des morts, Flétrissement, Parler avec les morts, Nuage mortel. « Poigne du dernier souffle » : 4d10 nécrotiques et réduit les PV max (JS Constitution DD 16, recharge 5-6). Résistance aux dégâts nécrotiques ; avantage aux JS contre la mort.</p>	\N	14	10	16	18	16	14	\N	\N	23f62138-662c-47d5-855d-bdf7acf09462	GOLIATH	MAN	\N	{}	\N	f	15	72	f	5
e4b5e257-5b43-4992-b7da-1e66bb568c22	Core Belan	<p>Homme aasimar, 34 ans. Longiligne et souple, épaules étroites, mains fines de musicien ; il tient peu de place dans une pièce, et toute la salle dès qu'il ouvre la bouche.</p>\n<p>Traits fins, presque trop réguliers, sur une peau pâle aux reflets dorés. Cheveux blond cendré mi-longs, noués bas sur la nuque. <strong>Yeux d'un blanc laiteux, sans iris ni pupille visibles</strong> — il voit pourtant parfaitement, et élude la question quand on la lui pose. Au-dessus de sa tête flotte en permanence une fine <strong>auréole blanche</strong>, large comme une assiette, qui n'éclaire presque rien.</p>\n<p><strong>Voix :</strong> ténor clair et chaud, qu'il pose très bas quand il parle — on se surprend à se pencher pour l'entendre, ce qu'il sait parfaitement. Débit lent, avec des silences qu'il laisse durer un temps de trop. En chantant, le timbre monte d'une octave et se charge d'un léger écho qui ne vient d'aucune salle. Dit « mon bon » à tout le monde, y compris à ceux qu'il déteste.</p>\n<p>L'auréole le trahit avant lui : elle vacille quand il ment, se resserre quand il a peur, s'embrase quand il chante juste — aussi joue-t-il de préférence dos à la salle, dans la pénombre de l'estrade. Accorde son luth entre deux phrases quand il est nerveux. Ne boit jamais ce qu'on lui offre : il le vide discrètement dans le pot de fougère au pied de l'estrade, laquelle se porte mal.</p>\n<p><strong>Rôle :</strong> barde de maison de <strong>La Loutre SAOUL</strong>. Il chante six soirs sur sept et fait salle comble les soirs de paie ; la taverne lui doit une bonne part de sa réputation aux Bas-Quais. Il connaît le nom, la dette et les travers de chaque habitué — on parle devant un musicien comme devant un meuble.</p>\n<p><strong>Rapport aux PJ :</strong> loyal à l'établissement et franchement hostile aux visites mensuelles d'<strong>Odon Pince</strong>, qu'il appelle « le percepteur » et à qui il dédie des couplets de moins en moins allusifs. Excellent relais d'informations pour qui prend le temps de l'écouter, et un levier tout trouvé si les PJ s'attaquent à la « contribution à la tranquillité » du Conseil d'Acier.</p>\n<p><strong>Secret (MJ) :</strong> il vend la liste des habitués de la Loutre à un « courtier en curiosités » qui le paie en pièces neuves. Il croit renseigner un collectionneur d'anecdotes ; c'est un relais de l'<strong>Œil Pourpre</strong>. Deux des noms qu'il a livrés ont disparu depuis. S'il venait à l'apprendre, il se dénoncerait de lui-même aux PJ plutôt que de continuer.</p>\n<p><strong>Secret (MJ), plus profond :</strong> il lui manque trois mois de mémoire — l'hiver de ses trente ans. L'auréole et les yeux blancs datent de cette période. Il a quitté Alagir cet hiver-là et n'a jamais su pourquoi il y est revenu. <em>Piste : le Voile de l'Oubli de <strong>Mirdobas Filan</strong>.</em></p>\n<p><strong>Capacités notables :</strong> Inspiration bardique, Contre-charme, Mots cinglants. Sorts : <em>Charme-personne</em>, <em>Image silencieuse</em>, <em>Repos hypnotique</em>, <em>Fracassement</em>, <em>Suggestion</em>, <em>Discours captivant</em>. Trait aasimar : <em>Âme radieuse</em> — auréole permanente, dégâts radiants une fois par repos long.</p>	\N	9	15	12	13	11	18	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	57210a91-4e46-40ee-9e76-a6abd07189b1	AASIMAR	MAN	OTHER	{COMMUN,CELESTE,ELFIQUE,ARGOT_VOLEUR}	cd218e67-1630-4948-a3e2-585a884aee96	f	14	40	f	3
776244d3-5c61-4b5e-afd2-3e926aaef5bd	Lysanne Orfe	<p>Femme humaine, 36 ans. Grande, silhouette élancée tenue par un maintien de danseuse ; elle traverse une salle sans jamais bousculer personne.</p>\n<p>Cheveux noirs relevés en couronne, teint clair, yeux noisette très mobiles qui inventorient une pièce en une seule passe. Sourire aimable, parfaitement calibré.</p>\n<p><strong>Voix :</strong> claire et cultivée, d'un timbre agréablement bas, sans l'accent d'aucun quartier. Débit fluide et sans accroc, comme récité — elle ne cherche jamais un mot. Termine ses phrases sur une note montante qui transforme chaque constat en question polie, et rend un refus très difficile à formuler.</p>\n<p>Porte des gants gris perle qu'elle n'ôte jamais, même à table. Offre systématiquement un compliment avant une mauvaise nouvelle. Ne boit que de l'eau.</p>\n<p><strong>Rôle :</strong> le visage présentable du Conseil. Officiellement « courtière en obligations », elle circule dans les salons, les bals et les conseils d'administration. C'est elle qui rappelle les échéances aux Maisons — avec des mots si polis que la menace n'est jamais prononcée. <strong>Présente au Bal Tovalis (Soir 1).</strong></p>\n<p><strong>Secret (MJ) :</strong> elle constitue son propre dossier sur Rany Mullimax. Elle ne veut pas sa place : elle veut pouvoir le vendre au Conseil international le jour où il déraillera.</p>	\N	10	15	12	15	14	18	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	CRIMINALITE	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	14	45	f	3
7a98f51c-2382-4a3c-9972-d28bd933e25c	Darn Fer-Vallée	<p>Homme nain, 34 ans. Trapu et compact, épaules larges, cou court ; il se déplace sans bruit pour sa carrure — une habitude de garde.</p>\n<p>Cheveux bruns coupés court, barbe brune taillée net. Yeux verts vifs et mobiles, qui font le tour d'une pièce avant de se poser sur quiconque. Nez droit, teint hâlé.</p>\n<p><strong>Voix :</strong> moyenne et claire, plus haut perchée qu'on ne s'y attend chez un nain. Débit prudent et mesuré devant les <strong>Tovalis</strong>, qui se détend d'un coup dès qu'il est entre gens de <strong>La Braise</strong>. Rit par le nez, sans bruit.</p>\n<p><strong>Rôle :</strong> garde chez les <strong>Tovalis</strong> et membre de la cellule de <strong>La Braise</strong>. Contact à <strong>La Roue de Secours</strong>, escorte vers le <strong>Palazzo Khaz'Kanoon</strong> et <strong>Harl Denvar</strong>. Frère aîné de <strong>Brynn Fer-Vallée</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	NAIN	MAN	\N	{}	\N	f	\N	\N	f	\N
d8e37ee1-afd3-4901-ba1b-74bc0479acd3	Merr Luth	<p>Homme nain, 97 ans, trapu. Mains larges et courtes aux doigts étonnamment précis. Tablier beige immaculé porté sur une chemise de lin bleu aux manches retroussées.</p>\n<p>Barbe noire tressée avec de fins anneaux d'argent. Yeux noisette perçants, peau tannée par les années passées derrière un comptoir.</p>\n<p><strong>Voix :</strong> grave et nette, avec une articulation de commerçant qui répète les commandes pour éviter les litiges. Débit méthodique, il énonce toujours poids, prix et total dans cet ordre, sans jamais en sauter un. S'interrompt au milieu d'une phrase pour corriger un chiffre, puis reprend au même mot.</p>\n<p><strong>Rôle :</strong> tient <strong>Le Poids Juste</strong> pour la <strong>Famille Cilovard</strong>. Note chaque commande au gramme près.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	NAIN	MAN	\N	\N	\N	f	11	24	f	1/4
b6d601cd-8b88-4656-a0d3-c8fb6c10808d	Quatre Nuits	<p>Homme goliath au <strong>regard doux</strong>. Grand et posé, gestes précis malgré des mains calleuses. Collier de pierres de lune qui vibrent quand il chante les formules d'envoûtement.</p>\n<p>Stries dorées sur les pommettes.</p>\n<p><strong>Voix :</strong> grave et posée, d'une chaleur qui met immédiatement à l'aise — et c'est là tout le danger. Débit lent et mélodieux, presque chanté sur les fins de phrase ; on se surprend à approuver avant d'avoir réfléchi. Quand il incante, la voix se stabilise sur une note unique tenue, et les pierres de lune du collier vibrent avec elle.</p>\n<p><strong>Rôle :</strong> maître enchanteur du <strong>Monastère des Nuits</strong>. École : <strong>Enchantement</strong>. Sculpte volontés et émotions.</p>\n<p><strong>Capacités notables :</strong> FP 5 · PV 46. Sorts signatures : Charme-personne, Sommeil, Immobilisation de personne, Suggestion. « Résonance des âmes » : charme ou apeure une cible (JS Sagesse DD 15, 1/jour). Immunité aux charmes non magiques.</p>	\N	14	10	16	17	15	18	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	GOLIATH	MAN	\N	\N	\N	f	13	46	f	5
e785fe6c-da97-416c-95a6-4102791b6640	Derrik Holmar	<p>Homme humain, la quarantaine, trapu. Bras épais, mains abîmées et calleuses ; une vieille entaille en biais sur l'avant-bras gauche, accident de taille.</p>\n<p>Visage buriné par le soleil et la poussière de calcaire des carrières du Nord ; cheveux roux coupés très ras, barbe de quelques jours négligée ; yeux bleu-gris méfiants sous un front plissé.</p>\n<p><strong>Voix :</strong> forte et râpeuse, la gorge irritée en permanence par la poussière de pierre ; il s'éclaircit la voix toutes les trois phrases. Débit lent et méfiant, avec une manie de répéter la question qu'on lui pose avant d'y répondre. Touche du bois avant d'annoncer un tonnage.</p>\n<p><strong>Rôle :</strong> contremaître <strong>Tovalis</strong> des carrières du Nord. Loyal, superstitieux.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	13	38	f	2
5e356a69-f3d4-4d03-8046-3f7f89c3512f	Ismara Cilovard	<p>Femme humaine, 25 ans, fille cadette <strong>Cilovard</strong>. Petite, traits délicats hérités de sa mère mais regard plus sincère. Robes pratiques aux couleurs neutres, peu de bijoux — une seule boucle d'oreille en lapis-lazuli.</p>\n<p>Cheveux auburn portés en tresse lâche qui glisse souvent sur l'épaule quand elle penche la tête sur ses livres de comptes. Yeux verts légèrement cernés, taches d'encre fréquentes aux doigts et parfois sur la joue.</p>\n<p><strong>Voix :</strong> claire et un peu jeune pour son rang, sans l'assurance travaillée du reste de sa famille. Débit rapide et précis sur les chiffres, hésitant dès qu'il faut donner un avis — elle commence alors ses phrases par « je me trompe peut-être ». Baisse les yeux en parlant, et les relève d'un coup quand elle dit enfin ce qu'elle pense vraiment.</p>\n<p><strong>Rôle :</strong> chargée de la logistique et du transport d'or. Moins ambitieuse, plus lucide — la conscience discrète de la famille.</p>\n<p><strong>Secret (MJ) :</strong> elle détient un registre chiffré prouvant un détournement de fonds au sein de sa propre Maison — le garder la ronge, le révéler la briserait.</p>\n<p><strong>Capacités notables :</strong> CA 13 · PV 32 · Dague +3. Regard sincère (avantage en Persuasion avec le peuple) ; Marque du remords — ses pièces noircissent quand elle ment.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	{}	\N	f	13	32	f	3
dbbe28fc-23e4-4d1a-af4c-0e15291ee906	Nimra	<p>Elfe androgyne, à la silhouette longiligne, d'une beauté ambiguë qui rend les étiquettes inutiles. S'habille de gris et de blanc, toujours un bougeoir en main, les doigts légèrement noircis de cire.</p>\n<p>Cheveux blanc argenté tombant librement sur les épaules, yeux d'un violet pâle presque translucide qui changent de teinte selon l'angle de la lumière. Traits d'une finesse extrême, lèvres minces, oreilles effilées portant de minuscules anneaux de verre teinté.</p>\n<p><strong>Voix :</strong> d'un registre indéfinissable, ni grave ni aiguë, si égale qu'on ne saurait la décrire une fois sorti — comme le reste. Débit très lent et murmuré, avec de longues pauses pendant lesquelles Nimra ajuste une bougie plutôt que de répondre. Ne s'adresse jamais à quelqu'un par son nom, ni par un titre.</p>\n<p><strong>Rôle :</strong> à <strong>La Verrière Fendue</strong>, pour la <strong>Famille Palhindile</strong>. Règle les bougies selon les reflets du vitrail.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	ELFE	OTHER	\N	\N	\N	f	12	22	f	1/2
c885e82c-e64e-48e8-8136-5f76d4d4611b	Eldric Rigart	<p>Homme humain, 23 ans, jeune héritier ; grand et mince pour son âge. Allure toujours élégante — pourpoint de velours marine, cape courte sur l'épaule ; mains soignées, bague de famille à l'annulaire.</p>\n<p>Traits fins et réguliers hérités d'une bonne lignée ; cheveux châtain clair coiffés avec soin vers l'arrière ; yeux gris-bleu vifs et avides.</p>\n<p><strong>Voix :</strong> jeune et bien placée, celle d'un garçon à qui on a payé des leçons de diction. Débit rapide et enthousiaste dès qu'il parle commerce, il s'emballe et enchaîne les projets sans reprendre son souffle. Depuis sa captivité, elle se casse au milieu des phrases et il regarde la porte avant de répondre.</p>\n<p><strong>Rôle :</strong> héritier <strong>Rigart</strong>, fils de <strong>Dorian Rigart</strong>. Discours au port sur l'alliance Cilovard (Partie 5). Vision d'un commerce fluvial ouvert.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	\N	\N	f	\N
148f0452-aa0f-42b1-83a4-23cb30cd0e18	Ordan Tovalis	<p>Homme humain, la quarantaine, à la carrure solide héritée des travailleurs de pierre mais avec la présence naturelle d'un orateur. Gestes amples qui prennent naturellement l'espace.</p>\n<p>Visage large à la mâchoire forte, nez légèrement aplati d'un vieux coup ; cheveux châtain foncé grisonnant aux tempes ; yeux marron foncé.</p>\n<p><strong>Voix :</strong> portante et grave, une voix de tribune qui accroche une foule de trois cents personnes sans estrade. Débit rythmé par la respiration, avec des répétitions en fin de phrase qui appellent l'adhésion — il sait exactement où placer un silence pour que la place le remplisse. Passe du registre soutenu au parler des carrières en une phrase, selon qui il veut rallier.</p>\n<p><strong>Rôle :</strong> porte-parole <strong>Tovalis</strong>. Protestation publique contre l'alliance Cilovard–Rigart sur l'estrade du port (Partie 5).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	\N	\N	\N	\N	f	\N	\N	f	\N
87e9c350-63f3-4a21-822a-dea94e663317	Rhendom Kinemor	<p>Homme, 61 ans, membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien. Grand et voûté, décharné ; il s'appuie sur une canne dont il n'a pas encore vraiment besoin.</p>\n<p>Visage creusé, pommettes hautes, teint cireux. Cheveux blancs fins, ramenés en arrière. Yeux bleu pâle délavés, mi-clos. Longues mains veinées.</p>\n<p><strong>Voix :</strong> faible et éraillée, avec l'accent pointu momoritanien devenu chuintant avec l'âge ; il faut se pencher, et personne n'ose demander qu'il répète. Débit très lent, entrecoupé de reprises de souffle. Se souvient de tout, et le rappelle avec une précision qui met les jeunes générations mal à l'aise.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
60ee9017-2f5a-45c6-90ae-e7f253db2093	Pelfort Vanguard	<p>Homme humain, la quarantaine bien tassée, de taille moyenne, au corps entretenu et au maintien militaire hérité d'une formation de chevalier. Toujours vêtu de pourpre sombre et d'or, jamais sans sa couronne en public.</p>\n<p>Mâchoire forte ; regard brun froid et calculateur qui ne s'éclaire jamais vraiment ; cheveux noirs soigneusement coiffés, barbe courte entretenue avec une précision royale.</p>\n<p><strong>Voix :</strong> grave, ample et parfaitement maîtrisée, celle d'un souverain qui a appris à porter jusqu'au fond d'une salle du trône. Débit lent et solennel, avec des pauses royales que nul n'ose combler. Un détail que peu relèvent : il ne reprend jamais son souffle au milieu d'une phrase, si longue soit-elle — et certaines le sont beaucoup trop pour un homme.</p>\n<p><strong>Rôle :</strong> monarque de la Cité Pourpre depuis cinq ans (mort royale suspecte). Centralise le pouvoir, réforme les impôts, surveille tout via le <strong>Soleil Pourpre</strong>. Tête de réseau de <strong>L'Œil Pourpre</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
da127a39-9689-4b08-a0c7-8467321f650e	Sept Nuits	<p>Femme goliathe aux <strong>proportions changeantes</strong> — parfois plus haute, parfois plus compacte selon l'heure du jour. Porte des outils alchimiques à la ceinture.</p>\n<p>Stries vertes comme de la mousse sur roche. Doigts longs, ongles de pierre polie.</p>\n<p><strong>Voix :</strong> son timbre change avec le reste — grave et caverneuse le matin, claire et presque juvénile en fin de journée, sans qu'elle paraisse s'en apercevoir. Débit régulier et didactique, ponctué de comparaisons matérielles : elle explique une idée par ce qu'elle deviendrait si on la chauffait. Ne se présente jamais deux fois de la même manière.</p>\n<p><strong>Rôle :</strong> maîtresse transmutatrice du <strong>Monastère des Nuits</strong>. École : <strong>Transmutation</strong>. Altère matière et forme.</p>\n<p><strong>Capacités notables :</strong> FP 5 · PV 50. Sorts signatures : Métamorphose, Hâte, Pierre en chair, Vol. « Reforge le vivant » : transforme un objet de 1 m³ en une autre matière non vivante (1/jour). Peut marcher sur les surfaces instables comme sur de la pierre plate.</p>	\N	14	10	16	18	13	12	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	GOLIATH	WOMAN	\N	\N	\N	f	14	50	f	5
850749b4-7031-4dcb-8f1b-ab7fffcea695	Tessa Kaorn	<p>Femme gnome, 74 ans. Menue et sèche, elle se tient très droite sur des chaises toujours trop grandes ; gestes économes, jamais un mouvement de trop.</p>\n<p>Cheveux blanc-gris tirés en chignon serré, visage étroit aux pommettes hautes, yeux noirs sans éclat. Un sourire bref, strictement professionnel.</p>\n<p><strong>Voix :</strong> fluette et parfaitement nette, sans chaleur ; elle articule chaque syllabe comme on coche une case. Débit lent et régulier, avec une pause avant le verbe, si bien qu'on attend toujours la fin de sa phrase. Ne hausse jamais le ton — quand elle est en colère, elle parle simplement encore plus lentement.</p>\n<p>Tient un carnet minuscule qu'elle referme d'un claquement sec. Emploie toujours le conditionnel pour annoncer une mauvaise nouvelle.</p>\n<p><strong>Rôle :</strong> coordinatrice des opérations de la cellule. Spécialiste des « réorganisations » : elle décide qui reste et qui disparaît. Calme, méthodique, jamais émotionnelle.</p>\n<p><strong>Secret (MJ) :</strong> elle tient un double registre des « réorganisations » — noms, commanditaires, montants. C'est sa seule assurance-vie face à Rany Mullimax.</p>	\N	8	16	12	16	15	13	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	e445a4a2-d1e3-4547-8dd7-4c9faf3e7463	GNOME	WOMAN	CRIMINALITE	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	13	42	f	5
71a8a898-169f-435b-bf0a-8c3933c60a8d	Jesa Tolvine	<p>Femme humaine, la cinquantaine, petite mais raide comme un piquet — elle impose par la seule intensité de son regard. Tenue de travail toujours propre, tablier de cuir épais, bottes solides.</p>\n<p>Cheveux gris fer coupés court, sans fioritures ; yeux noirs tranchants ; une cicatrice en arc traverse son menton, éclat de roc reçu à vingt ans.</p>\n<p><strong>Voix :</strong> sèche et coupante, calibrée pour porter par-dessus le bruit des maillets ; elle ne l'adoucit pas en intérieur. Débit bref, à l'impératif, sans bonjour ni au revoir. Le seul compliment qu'elle accorde est un « ça ira », et ses tailleurs de blocs s'en contentent.</p>\n<p><strong>Rôle :</strong> contremaître à la taille de bloc, pour la <strong>Famille Tovalis</strong>. Exigeante, respectée.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	12	34	f	2
7decf0c5-b84f-4a4b-b666-c9d820a104dc	Aegeard Blanks	<p>Homme humain, costaud, environ 1,70 m. Tunique ample bleu foncé, pantalon marron pratique et taché.</p>\n<p>Visage rond marqué par les excès ; cheveux blonds courts et bouclés, très courte barbe en van dyke soigneusement entretenue ; yeux dorés vifs et méfiants qui observent sans cesse la salle ; peau blanche et rugueuse.</p>\n<p><strong>Voix :</strong> grave et éraillée, et surtout très rare — il <strong>parle peu</strong>, répond par un mot ou un grognement, et laisse les clients meubler. Débit lent quand il s'y met, sans jamais monter le ton même pour séparer une bagarre : il pose seulement les mains à plat sur le comptoir. Salue les habitués d'un seul mot, toujours leur prénom, jamais rien d'autre.</p>\n<p><strong>Rôle :</strong> logisticien du <strong>Syndicat</strong>, sert à <strong>La Salamandre Savoureuse</strong>. Sert vite et n'oublie jamais un visage — on dit qu'il sait qui appartient au Syndicat… et qui n'y survivra pas longtemps.</p>\n<p><strong>Capacités notables :</strong> PV 60 · CA 14. Solide comme le Comptoir : résistance aux dégâts contondants. Coup de Pression : une créature touchée a désavantage à sa prochaine attaque. Gourdin de taverne : +6, 1d8+3. Projection : test de FOR opposé → à terre.</p>	\N	16	10	16	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	MAN	\N	{ARGOT_VOLEUR,COMMUN}	\N	f	14	60	f	\N
d0b4d7af-c5c3-4cc5-8fdd-e1505a6aaa7d	Old Ashka	<p>Homme humain très âgé. Petit et tassé, assis presque en permanence près du <strong>Cercle des Braises</strong>, un bâton d'histoire encoché à chaque récit conté posé sur les genoux.</p>\n<p>Visage buriné, creusé de rides profondes. <strong>Yeux d'un blanc laiteux</strong> depuis « une vision qui l'a brûlé ». Cheveux blancs rares, tressés de lanières.</p>\n<p><strong>Voix :</strong> rauque et posée, usée par des décennies de fumée et de récits ; elle s'éraille sur les longues phrases et il boit entre deux contes. Débit très lent, cadencé sur les coups de son bâton d'histoire, avec des silences que l'auditoire a appris à ne pas combler. Quand il conte, la voix change complètement : elle s'affermit, prend un timbre de jeune homme, et redevient vieille à la dernière phrase.</p>\n<p><strong>Répertoire de récits</strong> (contre un récit du visiteur, ou parfois gratuitement s'il apprécie l'interlocuteur) :</p>\n<p><strong>Le Cavalier du Ciel</strong> — Vaskar Skoren dressa un pégase blessé tombé du ciel et devint l'éclaireur ailé de la tribu. Il tomba en défendant les steppes contre les légions de Zarak Solara, qui fit tanner la dépouille de sa monture en cape, trophée d'humiliation. <em>Révèle l'origine et l'importance de la cape conservée dans le tertre des Ombre.</em></p>\n<p><strong>La Faille qui a Tenu</strong> — Kaddar Kharvek, premier « Porte-Faille », tint seul une brèche une nuit entière face aux morts-vivants de Zarak Solara pour couvrir l'évacuation des siens ; au matin, ni corps ni arme, seulement la faille refermée. <em>Explique le poids du titre que porte aujourd'hui Drogan Kharvek.</em></p>\n<p><strong>Le Serment Rompu</strong> — un jeune guerrier promit à Ral Odius de ne jamais tirer sur un ennemi désarmé en échange d'un vent favorable ; le jour où il rompit son serment par orgueil, le vent dispersa son camp. <em>Conte moral sur la valeur d'une parole donnée aux Beor Khan.</em></p>\n<p><strong>Les Huit qui Comptent leurs Nuits</strong> — il y a longtemps, huit moines encapuchonnés venus des montagnes du nord traversèrent les terres du clan sans un mot, sinon des chiffres en guise de noms. Le dernier, portant un froid qu'aucun feu ne réchauffait, s'arrêta longuement devant les tentes des morts avant de repartir. Depuis ce jour, dit-on, une des huit voies s'est brisée et un neuvième marche seul, sans titre, sans cercle pour l'accueillir. <em>(Ashka ignore tout lien avec un PJ éventuel — pur hasard troublant à exploiter si Neuf Nuits l'entend.)</em></p>\n<p><strong>Le Chant de la Terre Vivante</strong> — mythe fondateur : Tal Odius rêva des montagnes, Ral Odius du ciel qui les frôle, et de leur rêve commun naquirent les plaines. Ral Alion y sema la vie sauvage, et Tal Brahnera jura de garder la paix entre eux tant que les Beor Khan chanteraient leur nom au Cercle des Braises. <em>Pure couleur spirituelle, sans enjeu mécanique.</em></p>\n<p><strong>Autres articles</strong> (contre récit ou troc) : amulette d'os gravée « porte-voix des ancêtres » (cosmétique, avantage RP en négociation avec les Beor Khan) — 10 po ou un récit ; petite pierre runique (souvenir, sans effet mécanique) — 3 po ; rumeurs et informations sur la région (le tertre, la Main du Silence, Zarak Solara) — gratuit s'il apprécie l'interlocuteur.</p>	\N	6	8	10	14	17	16	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	MAN	OTHER	\N	\N	f	\N	\N	f	\N
f15655ae-460d-43a7-b970-147cae70e406	Brynn Fer-Vallée	<p>Femme naine, 28 ans, sœur cadette de <strong>Darn Fer-Vallée</strong>. Trapue et robuste, les mains calleuses de quelqu'un qui travaille dur.</p>\n<p>Un visage ouvert et expressif qui trahit chaque émotion avant même qu'elle parle. Cheveux brun foncé coupés court en désordre, yeux noisette grands et francs. Une cicatrice en demi-lune sous l'œil droit — elle dit que c'est un accident, ses anciens compagnons disaient autrement.</p>\n<p><strong>Voix :</strong> claire et un peu trop forte, avec le rire facile de quelqu'un qui veut que ça se passe bien. Débit rapide et enthousiaste quand elle est en confiance, coupé net dès qu'on la met en cause — elle se tait alors complètement plutôt que de se défendre. Appelle tout le monde par un diminutif au bout de dix minutes.</p>\n<p><strong>Rôle :</strong> Brynn est naïve de la belle sorte — elle croit facilement aux gens, voit le meilleur en eux bien plus longtemps qu'elle ne devrait, et déteste l'idée que quelqu'un puisse la manipuler délibérément. Cette confiance lui a valu de mauvaises fréquentations à répétition : des gens qui lui ont fait miroiter de l'amitié, de l'appartenance, un but, avant de se servir d'elle comme intermédiaire ou de faire peser les risques sur ses épaules.</p>\n<p>C'est ainsi qu'elle s'est retrouvée mêlée au <strong>Fretin</strong>, un groupe de bandits et contrebandiers dont la planque est dans les égouts sous la Porte Basse d'Alagir. Elle croyait rejoindre des gens dans le besoin qui s'entraidaient ; elle sert surtout de passeur et de couverture sans en mesurer pleinement les conséquences.</p>\n<p><strong>Secret (MJ) :</strong> Darn le sait, et ça l'inquiète plus qu'il ne le montre. Leurs relations sont tendues — il essaie de la prévenir, elle entend des reproches et se braque. Mais elle n'est pas perdue : quelqu'un de patient qui lui parle honnêtement pourrait l'atteindre.</p>	\N	14	13	15	10	8	11	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	NAIN	WOMAN	CRIMINALITE	\N	\N	f	13	38	t	1
a4710472-7788-4b90-bd60-337c7c035936	Capitaine Sorne Vask	<p>Homme demi-orc, 44 ans. Sec et nerveux pour un demi-orc, tout en tendons ; démarche de soldat, épaules basses.</p>\n<p>Peau gris-vert, mâchoire longue, cheveux noirs attachés court. Une cicatrice de garrot lui barre la gorge.</p>\n<p><strong>Voix :</strong> raclée, presque soufflée — le garrot lui a abîmé la gorge et il ne dépasse jamais le volume d'une conversation, même pour donner un ordre. Débit haché, par groupes de trois ou quatre mots. Ses hommes se taisent pour l'entendre, et ça lui tient lieu d'autorité. Tousse entre ses phrases quand il a trop parlé.</p>\n<p>Compte à voix basse avant d'agir. Entretient ses armes en public, comme une démonstration. Ne s'assoit jamais dos à une porte.</p>\n<p><strong>Rôle :</strong> capitaine des « <strong>Marteaux</strong> », le bras armé de la cellule — une trentaine d'hommes cantonnés au <strong>Hangar du Poids</strong>. Escortes, intimidations, et tout ce que le Soleil Pourpre n'a pas le droit de faire.</p>\n<p><strong>Secret (MJ) :</strong> il a servi dans le Soleil Pourpre et en a été chassé ; la moitié de ses hommes aussi. Il ne cherche pas la guerre avec la garde — il attend l'occasion de l'humilier.</p>	\N	18	14	17	12	13	13	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	c7279c93-060a-4b73-906a-4353b2ce1f15	DEMI_ORC	MAN	MILITAIRE	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	17	105	f	6
4168e798-427a-474b-bb0c-cd5b07258f43	Adeptus de l'Effacement	Humain d'apparence quelconque, au visage volontairement oubliable — on ne se souvient jamais de ses traits (c'est le principe même de sa formation).\n\nSoldat mental mineur formé par Mirdobas Filan.\nFrappe psychique : +6, portée 18 m, 3d6 psychique.\nSorts : Charme-personne, Dissonant Whispers, Suggestion, Modify Memory.\nCapacités : Visage oubliable, Discipline mentale.	\N	10	14	13	15	14	16	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	\N	MILITAIRE	{COMMUN,TELEPATHIQUE}	\N	t	14	44	f	4
ac6edfec-979b-4a5c-9414-df15cfd520db	Sheli Doxe	<p>Homme, 52 ans. Corpulent et jovial, la poignée de main facile ; il traverse le port en saluant tout le monde par son prénom.</p>\n<p>Visage rond et rougi par le vent marin, favoris épais. Cheveux châtains clairsemés. Yeux bleus rieurs, cernés de rides de sourire. Écharpe de fonction portée de travers.</p>\n<p><strong>Voix :</strong> forte et cordiale, réglée pour les quais et les discours d'inauguration. Débit généreux et bavard, riche en anecdotes portuaires ; il promet volontiers, et se souvient rarement d'avoir promis. Baisse d'un ton et devient évasif dès qu'on parle des cargaisons qui n'apparaissent sur aucun registre.</p>\n<p><strong>Rôle :</strong> maire de la ville portuaire de <strong>Karni</strong>, dans le <strong>Dominion de L'Antre</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	443543db-314f-472e-a899-3d42f34fdb5f	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
0faeab92-8111-4d00-983d-ce7124f1f6c4	Skorri Elurra	<p>Homme drakéide, 61 ans, de la maison <strong>Elurra</strong>. Massif et légèrement voûté, la carrure d'un guerrier que l'âge a tassé sans l'amoindrir.</p>\n<p>Écailles gris-bleu ardoise, la livrée des Elurra, ternies et grêlées par les années. Cornes épaisses striées de fêlures anciennes, cerclées d'argent. Yeux verticaux d'un bleu glacier délavé.</p>\n<p><strong>Voix :</strong> profonde et râpeuse, avec le sifflement drakéide accentué par l'âge. Débit lent et pesant, économe ; il ne parle qu'après que tout le monde a fini. Ponctue ses interventions d'un claquement de griffes sur l'accoudoir, tic que la cour de Brodnica a appris à redouter.</p>\n<p><strong>Rôle :</strong> membre de la maison <strong>Elurra</strong>, à Brodnica.</p>	\N	10	10	10	10	10	10	\N	\N	\N	\N	MAN	OTHER	{COMMUN}	\N	f	\N	\N	t	\N
bf83f60c-954f-43bd-896f-4e9af98d6e43	Snakha	<p>Homme, 48 ans. Grand et sec, d'une raideur de prédateur au repos ; il s'assoit très en arrière et laisse <strong>ForteGriffe</strong> occuper l'espace devant lui.</p>\n<p>Visage anguleux et creusé, teint gris. Cheveux noirs plaqués en arrière, tempes rasées. Yeux noirs sans fond, très peu expressifs. Une longue cicatrice fine court de l'oreille droite à la clavicule.</p>\n<p><strong>Voix :</strong> douce et basse, presque courtoise, d'une amabilité qui ne varie jamais — y compris pour ordonner une exécution. Débit lent, avec de longues pauses pendant lesquelles il vous regarde sans ciller. Ne répète jamais une proposition : il la fait une fois, puis parle d'autre chose.</p>\n<p><strong>Rôle :</strong> représentant du <strong>Conseil d'Acier</strong> pour l'île de l'Antre et chef local du <strong>Syndicat</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
efa72d8b-f525-4adf-9f29-497eb2301563	Sylvae Irithiel — La Voix des Collines	<p>Femme humaine, 63 ans, grande druide des <strong>Beor Khan</strong>. Grande et sèche, noueuse comme une racine ; elle marche pieds nus sur les steppes par tous les temps.</p>\n<p>Visage tanné et anguleux, pommettes hautes. Cheveux gris-blond emmêlés de brindilles et de lanières de cuir. Yeux verts très clairs, presque translucides. Peau des mains craquelée, teintée de terre.</p>\n<p><strong>Voix :</strong> ample et grave, avec une résonance étrange qui semble venir du sol autant que de sa gorge — d'où son titre. Débit lent et scandé, très proche du chant ; elle module la hauteur en fin de phrase comme on module un appel. Sous forme animale, elle conserve ce phrasé : le croassement du corbeau suit la même cadence à trois temps.</p>\n<p><strong>Rôle :</strong> grande druide des <strong>Beor Khan</strong>.</p>\n<p><strong>Capacités notables :</strong> PV 110 · CA 15. DD des sorts 17, attaque magique +9. Sorts : Guidance, Fouet d'épines, Druidcraft (à volonté) ; Croissance d'épines, Appel de la foudre, Croissance végétale (3/jour) ; Mur de pierre, Communion avec la nature (1/jour). Bâton des Collines : +6 (1d8+2 contondant + 1d8 nature). Voix de la Terre : terrain difficile pour les ennemis à 9 m. Souffle des Steppes : alliés à 9 m, +3 m de déplacement. Perception Tellurique : détecte vibrations et mouvements jusqu'à 18 m.</p>	\N	10	14	18	15	20	16	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	WOMAN	RELIGEUX	{}	\N	f	15	110	f	\N
1e41100b-8f76-40d2-8917-849fb35fa1e3	Sabine Quenot	<p>Femme naine, 61 ans. Courte et large, avant-bras de forgeronne à force de pétrir et de porter des marmites de fonte ; elle se déplace vite malgré la carrure, écartant les gens du coude sans s'excuser.</p>\n<p>Visage rond et rougi par la chaleur des fourneaux, nez cassé jamais remis droit. Cheveux gris fer tressés serré et enroulés sous un foulard qui fut blanc. Yeux noisette très vifs sous des sourcils broussailleux. Une vieille brûlure court de son poignet droit jusqu'au coude.</p>\n<p><strong>Voix :</strong> de rogomme, éraillée par quarante ans de vapeur et de fumée de cambuse ; elle porte d'un bout à l'autre de la salle sans qu'elle ait besoin de crier. Débit en rafales courtes, presque des ordres, avec un temps d'arrêt avant chaque chiffre. Bascule dans le nain pour jurer, et personne n'a jamais osé lui demander la traduction.</p>\n<p>Goûte tout avec le même couteau, qu'elle essuie sur son tablier. Compte à voix haute quand elle est contrariée — arrivée à dix, quelqu'un sort de sa cuisine. Refuse catégoriquement qu'on entre dans son réduit à provisions, propriétaires compris. Toute la salle l'appelle « <strong>la Louche</strong> », y compris les habitués qui n'ont jamais su son nom.</p>\n<p><strong>Rôle :</strong> cuisinière engagée par les PJ pour la réouverture de <strong>La Loutre SAOUL</strong>. Trente ans de cambuses sur les navires marchands avant de poser son sac aux Bas-Quais : elle sait nourrir quarante personnes avec trois fois rien, et repérer une denrée avariée à l'odeur à travers une caisse fermée. Son ragoût de poisson au poivre noir fait déjà partie de la réputation de la maison.</p>\n<p><strong>Secret (MJ) :</strong> son réduit à provisions donne sur la trappe de contrebande. Elle l'a compris dès la première semaine et n'en a rien dit — elle attend de voir quel genre de patrons sont les PJ. Elle tient un compte exact de ce qui transite ; pas pour le vendre, pour savoir dans quoi elle travaille.</p>	\N	15	10	16	11	14	12	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	57210a91-4e46-40ee-9e76-a6abd07189b1	NAIN	WOMAN	OTHER	{COMMUN,NAIN}	cd218e67-1630-4948-a3e2-585a884aee96	f	12	30	f	1/2
62eb8859-aecc-4577-9674-feae24ddf538	Sesk Orlo	<p>Homme humain, la quarantaine, sec et nerveux. Toujours en mouvement, à se gratter l'avant-bras ou à vérifier ses poches.</p>\n<p>Cheveux gras noués en catogan ; cicatrices de couteau aux avant-bras ; sourire de fouine à qui il manque deux dents. Il sent l'égout et l'eau-de-vie.</p>\n<p><strong>Voix :</strong> aiguë et volubile, avec un rire sifflant qui ponctue ses propres mensonges. Débit de camelot — il parle vite, beaucoup, et colle un surnom affectueux à tout le monde dès la deuxième phrase. Dès qu'on le domine, le débit s'effondre : il bafouille, répète « attends, attends » et négocie.</p>\n<p><strong>Rôle :</strong> chef du <strong>Fretin</strong>. Beau-parleur, il a « adopté » <strong>Brynn Fer-Vallée</strong> en lui offrant une fausse famille, pour mieux l'utiliser comme passeuse — puis l'a bouclée quand elle a compris la nature du fret.</p>\n<p><strong>Secret (MJ) :</strong> vénal, il a vendu son âme (et Brynn) pour le contrat <strong>Mastiggia</strong> ; lâche dès qu'on le domine.</p>\n<p><strong>Capacités notables :</strong> bandit capitaine (FP 2). CA 15 · PV 65 · Init +3. Multiattaque : 2 cimeterres (+5, 1d6+3 tranchant) + 1 dague (+5, 1d4+3). Parade : +2 CA en réaction contre une attaque de mêlée qu'il voit venir.</p>	\N	15	16	14	14	11	14	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	CRIMINALITE	\N	\N	f	15	65	f	2
ad6c6045-a171-4de7-9126-f8be53be760f	Naela Torfin	<p>Femme humaine, trente-cinq ans, compacte et nerveuse, aux gestes précis et économes hérités d'une vie à travailler les métaux délicats. Tablier de cuir épais aux initiales « FTB » gravées, chemise à manches retroussées, lorgnon de précision souvent relevé sur le front.</p>\n<p>Cheveux roux cuivré toujours attachés en tresse serrée, par sécurité ; visage fin semé de taches de rousseur, contrastant avec de petites brûlures presque imperceptibles sur les mains et les avant-bras ; yeux brun-roux vifs, pétillants d'intelligence pratique.</p>\n<p><strong>Voix :</strong> claire et rapide, avec un tranchant qui apparaît dès qu'on met en doute son travail. Débit précis et technique, elle emploie le vocabulaire exact des coins et des alliages sans se demander si on la suit. Monte d'un ton et accélère si l'on compare son atelier aux fonderies royales — elle juge la comparaison « indécente et hors de propos ».</p>\n<p><strong>Rôle :</strong> maîtresse de <strong>La Frappe Brillante</strong>, troisième génération des Torfin à tenir l'atelier. Directe et fière.</p>	\N	12	16	13	15	14	13	\N	57171985-dade-4fcc-a00b-c06de058c7d6	a125f5fb-f383-4013-9124-5b045718d5d9	HUMAIN	WOMAN	MARCHAND	{COMMUN}	\N	f	13	35	f	2
558617f8-a75f-41f8-b9d9-0720d71e7754	Sir Gadwain Brise-fer	<p>Homme humain, vétéran d'âge mûr, à la large carrure de porteur d'armure lourde. Port droit et solennel.</p>\n<p>Visage carré buriné par les campagnes, cheveux poivre et sel coupés court, courte barbe soignée.</p>\n<p><strong>Voix :</strong> grave et chaleureuse, avec une rondeur qui rassure — ses hommes disent qu'elle porte mieux qu'un bouclier. Débit posé et courtois, il vouvoie tout le monde, y compris les recrues. En combat, le registre change du tout au tout : trois mots, hurlés, et la ligne tient.</p>\n<p><strong>Rôle :</strong> Gardien de l'Honneur — Capitaine de la Garde de la <strong>Garnison des écus d'or</strong>. Loyal bon. Bouclier vivant de ses alliés grâce à son trait <strong>Mur de Fer</strong> et sa capacité <strong>Indomptable</strong>.</p>\n<p><strong>Capacités notables :</strong> PV 138 · CA 18.</p>	\N	19	12	17	11	14	15	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	HUMAIN	MAN	MILITAIRE	{}	\N	f	18	138	f	\N
673d6e5a-9fee-4013-8a2c-5d8beee96121	Symma Turen	<p>Femme gnome, 134 ans. Menue et très droite, perchée sur un siège rehaussé au Magisterium ; elle croise les mains et ne bouge pratiquement pas de toute une séance.</p>\n<p>Visage fin et lisse pour son âge, teint clair. Cheveux blancs coupés au carré, impeccables. Yeux mauves pâles, d'une attention totale. Bagues d'enchanteur à trois doigts.</p>\n<p><strong>Voix :</strong> claire et mélodieuse, d'une douceur qui met immédiatement à l'aise — et c'est précisément son école. Débit lent et régulier, avec une cadence berçante sur les fins de phrase ; les débats qu'elle préside s'apaisent sans que personne sache pourquoi. Ne hausse jamais le ton : elle ralentit, et l'assemblée se cale sur elle.</p>\n<p><strong>Rôle :</strong> archimage et représentante d'<strong>Iserna</strong> au <strong>Magisterium</strong> des Duchés des Dolomites. École d'enchantement.</p>	\N	10	10	10	10	10	10	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	GNOME	WOMAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
99ac533f-31ab-4ef0-a2db-0fe20afbab6f	Chambellan Aldric Vorréal	<p>Homme humain, environ 52 ans. Sec et de taille moyenne, maintien rigide de haut fonctionnaire, gestes économes.</p>\n<p>Visage étroit et glabre, front dégarni, cheveux gris coupés court ; yeux gris pâle au regard fixe et patient.</p>\n<p><strong>Voix :</strong> posée, presque douce, d'une neutralité soigneusement travaillée — aucun accent, aucune région, aucune classe. Débit égal et lent, avec une courte pause avant chaque nom propre, comme s'il le rangeait quelque part en le prononçant. Ne dit jamais « je » : il dit « la Couronne ».</p>\n<p>Toujours ganté de sombre, chaîne d'office au col, un petit carnet de cuir qu'il n'ouvre jamais en public.</p>\n<p><strong>Rôle :</strong> chambellan de la Cour, dépêché au Bal Tovalis pour porter les excuses du <strong>Roi Pelfort, officiellement souffrant</strong>. Courtois et protocolaire, il transmet les vœux de la Couronne… et observe.</p>\n<p><strong>Secret (MJ) :</strong> relais du <strong>Soleil Pourpre</strong>. Sous couvert d'excuses royales, il jauge les trois Maisons, mémorise propos et alliances, et en rend compte. Insigne pourpre dissimulé dans la doublure ; sa mémoire est trop parfaite pour être naturelle.</p>	\N	10	11	11	15	14	15	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	POLITIC	\N	\N	f	12	22	f	1
589e87f0-c830-415f-9667-71c9833766bd	Abbesse Serel	<p>Femme humaine, 58 ans. Petite et ronde, le dos droit malgré les heures d'office ; elle marche les mains jointes devant elle, à petits pas réguliers.</p>\n<p>Visage plein et doux, joues rougies par le froid des nefs, cheveux blancs coupés court sous le voile. Yeux bleus délavés, très attentifs, qui ne lâchent pas leur interlocuteur. Une cicatrice fine à la lèvre supérieure, dont elle ne parle pas.</p>\n<p><strong>Voix :</strong> chaude et ample, faite pour le chant liturgique et l'acoustique du Grand Temple — elle porte sans effort jusqu'au fond de la nef. Débit lent et scandé, avec une pause après chaque proposition, comme si elle laissait le temps d'acquiescer. Passe au murmure dès qu'elle s'adresse à une seule personne, et c'est là qu'on l'écoute le mieux.</p>\n<p><strong>Rôle :</strong> abbesse du <strong>Grand Temple</strong> (Ral &amp; Tal Olena / Tal Odius). Détentrice d'un fragment de vitrail « vivant ».</p>\n<p><strong>Capacités notables :</strong> CA 13 · PV 32. Religion +6, Médecine +5.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	fd8ed968-cfd3-4d8b-a06f-f65097ae8f5b	HUMAIN	WOMAN	\N	\N	de27c25a-119c-4435-a163-59bdc7240279	f	13	32	f	2
2842beda-2407-4743-8e3e-3b1a4e026bd5	Baronne Alna Vis	<p>Femme humaine, 49 ans. Grande et sèche, port raide de cavalière ; elle s'assoit toujours au bord du siège, dossier jamais touché.</p>\n<p>Visage anguleux, nez fort, cheveux auburn tirés en arrière sans une mèche libre. Yeux gris sous des paupières lourdes. Une paire de lorgnons qu'elle chausse pour lire les chiffres et retire pour regarder les gens.</p>\n<p><strong>Voix :</strong> nette et métallique, avec l'autorité de quelqu'un qu'on n'interrompt pas deux fois. Débit rapide et sans fioriture : elle annonce les montants avant les noms. Termine ses entretiens par « Nous en resterons là », qui ne souffre pas de réponse.</p>\n<p><strong>Rôle :</strong> baronne comptable, directrice de la <strong>Couronne de Platine</strong>. Gère le capital-risque, les dotations nobiliaires et les grands travaux. Très proche des <strong>Cilovard</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	\N	\N	f	13	44	f	4
5f7057a8-b5e3-4947-b846-16f62dd43d39	Bord Amac	<p>Homme humain, la quarantaine, au ventre généreux qui témoigne d'une vie de bonne chère et de tavernes. Mains calleuses, souvent une tache de goudron sur la paume ou le poignet ; veste de marinier élimée.</p>\n<p>Teint rubicond des grands buveurs ; cheveux noirs clairsemés en désordre ; moustache épaisse sous un nez cassé ; yeux marron toujours un peu rieurs.</p>\n<p><strong>Voix :</strong> forte et enrouée, avec un rire qui part du ventre et s'entend d'un quai à l'autre. Débit bavard, plein de digressions dont il ne revient pas toujours ; il raconte deux fois la même histoire dans la même soirée sans s'en apercevoir. Jure par « les crues » à tout bout de champ.</p>\n<p><strong>Rôle :</strong> contremaître du transport fluvial. Bon vivant, corrompu par le <strong>Syndicat</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	11	28	f	1
0b636012-fa99-47bc-9147-8b8db7a4f6e9	Capitaine Norven	<p>Homme humain, 71 ans. Maigre et noueux, le dos voûté par soixante ans de pont — il garde pourtant un équilibre parfait sur un plancher qui bouge, et le perd sur la terre ferme.</p>\n<p>Visage tanné et creusé, barbe grise tressée en deux nattes serrées. Yeux bleus délavés, plissés par le sel. Habit de capitaine impeccable malgré l'âge, boutons astiqués chaque matin.</p>\n<p><strong>Voix :</strong> éraillée et puissante, réglée pour couvrir le vent — il parle donc trop fort partout ailleurs, et ne s'en rend pas compte. Débit lent, ponctué de silences pendant lesquels il regarde au loin. Emploie un vocabulaire de marine que personne à terre ne comprend, et ne traduit jamais.</p>\n<p><strong>Rôle :</strong> capitaine de navire pour le <strong>Syndicat d'Alagir</strong>. On le trouve au <strong>Radeau du Percé</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	2022752e-1367-4834-8dae-099de55c5977	HUMAIN	MAN	\N	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	13	32	f	2
036cc087-0782-4d13-8cf5-f489d0b0839f	Dame Arinthe	<p>Femme humaine, d'âge indéterminable — entre trente et cinquante selon la lumière. Grande, d'une beauté statuaire, immobile au point qu'on la prend parfois pour un élément du décor avant qu'elle ne se tourne.</p>\n<p>Beauté froide et régulière, teint très pâle, cheveux noirs lisses ramenés en arrière. Yeux trop fixes, qui ne clignent pas assez souvent et mettent mal à l'aise. Toujours en robes de velours noir, jamais un bijou.</p>\n<p><strong>Voix :</strong> basse et lente, d'une douceur appliquée ; elle ne dépasse jamais le volume d'une confidence, si bien qu'on se penche vers elle sans l'avoir décidé. Débit très régulier, sans respiration audible entre les phrases. Ne dit jamais « non » : elle dit « pas ce soir ».</p>\n<p><strong>Rôle :</strong> maîtresse des lieux à <strong>La Vigne Noire</strong>, pour le <strong>Syndicat d'Alagir</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	d902d048-c851-4cc8-b19e-5936ccf928b7	HUMAIN	WOMAN	\N	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	14	40	f	3
80891668-5ad8-47a2-ae29-1e6d79be3160	Cryta	<p>Demi-orc, ~40 ans. Corps trapu et musclé, mouvements lents et mesurés qui dissimulent une réactivité redoutable. Tenue de garde simple, hache à la ceinture.</p>\n<p>Peau verte, crocs légèrement proéminents, yeux jaunes perçants, cheveux noirs striés de gris coupés ras sur les côtés. Une cicatrice en diagonale marque la joue gauche.</p>\n<p><strong>Voix :</strong> basse et rauque, économe, avec de longs silences entre les phrases que personne n'ose combler. Débit très lent — chaque mot semble pesé avant d'être lâché. Ne salue pas ; incline la tête. Quand elle corrige un élève à l'entraînement, elle ne dit qu'un mot : le nom du défaut.</p>\n<p><strong>Rôle :</strong> garde en entraînement avec <strong>Harl Denvar</strong> au Palazzo, pour la <strong>Famille Tovalis</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	39f35f74-b359-4703-90c3-bf89b9bc32b5	DEMI_ORC	\N	\N	\N	de27c25a-119c-4435-a163-59bdc7240279	f	14	45	f	3
bcbef7a5-9109-44f2-a960-351ae35476db	Daren Tovalis	<p>Homme humain, 54 ans. Large carrure d'ancien contremaître, épaules épaisses mal contenues par des vêtements de politicien ; mains marquées par la pierre, ongles qu'aucun soin n'a rattrapés.</p>\n<p>Visage carré et rougeaud, mâchoire lourde, cheveux poivre et sel coupés court. Sourcils broussailleux, yeux marron enfoncés qui jaugent avant de saluer. Une entaille ancienne au menton, souvenir de carrière.</p>\n<p><strong>Voix :</strong> puissante et rocailleuse, une voix de chantier qu'il a appris à contenir dans les salons sans jamais tout à fait y parvenir. Débit direct, phrases courtes, aucune formule de politesse superflue. Ponctue ses décisions d'un « voilà qui est dit » après lequel il ne revient pas.</p>\n<p><strong>Rôle :</strong> patriarche de la <strong>Maison Tovalis</strong>. Ancien contremaître devenu politicien, fin stratège économique, siège au <strong>Conseil Restreint</strong>. Contrôle 3 000 travailleurs et 8 carrières principales. Motivation : préserver l'équilibre d'Alagir. « <em>Tout se paie, même la loyauté.</em> »</p>\n<p><strong>Secret (MJ) :</strong> il a découvert un document prouvant que le Roi n'est pas ce qu'il semble.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	{}	\N	f	13	72	f	5
56b8619e-f374-44f2-9c1f-38066674cde1	Donna Ilaria Mastiggia	<p>Femme humaine, la cinquantaine, aristocrate dolomicienne à l'élégance glaçante. Grande et mince, épaules effacées, port impeccable ; elle ne touche jamais le dossier d'un siège.</p>\n<p>Cheveux noirs striés d'argent pris dans une résille de perles d'ambre. Visage long, pommettes hautes, teint poudré. Sourire commercial permanent, qui n'atteint jamais les yeux. Robes de velours sombre, éventail d'os gravé.</p>\n<p><strong>Voix :</strong> douce et basse, d'une politesse impeccable qui ne varie pas d'un demi-ton, qu'elle vous serve du thé ou un prix. Débit lent et articulé, avec un léger accent dolomicien sur les voyelles longues. N'emploie jamais le mot « esclave » : elle dit « les effectifs », « la marchandise », « nos engagements ».</p>\n<p><strong>Rôle :</strong> matriarche du comptoir Mastiggia d'Alagir (<strong>Larmes d'Ambre</strong>) et visage respectable de la maison. Elle gère la traite d'esclaves <em>légale</em> — autorisée à Alagir, dans les Dolomites et en Gandorenne — connaît chaque clause de la loi et ne se salit jamais les mains. Membre du clan <strong>Izotzargi</strong>, ligne « Chaînes du Sang ».</p>\n<p><strong>Secret (MJ) :</strong> les « exportations spéciales » — la revente aux vampires — elle préfère les ignorer et les laisse à <strong>Vittore</strong>.</p>	\N	9	11	10	15	14	17	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	MARCHAND	\N	\N	f	\N	\N	f	\N
2fe07498-32d6-42d5-bddb-4ac24ef2d003	Sélas Vharkorn	<p>Homme (émissaire vampire), à la silhouette longue et pâle. Très mince, d'une immobilité parfaite entre deux gestes ; vêtements d'un autre siècle impeccablement tenus. Une odeur de terre froide l'accompagne.</p>\n<p>Peau translucide veinée de gris ; yeux d'un rouge éteint ; traits fins et figés.</p>\n<p><strong>Voix :</strong> <strong>douce et lente</strong>, d'une courtoisie surannée, avec des tournures de phrase tombées en désuétude depuis deux siècles. Débit très étale, sans respiration audible — il n'en a pas besoin, et cela finit par se remarquer. Ne hausse jamais le ton ; quand la négociation se dégrade, il se contente de cesser de parler.</p>\n<p><strong>Rôle :</strong> émissaire de la cité vampire souterraine de <strong>Nharivum</strong>, creusée sous <strong>Mongar</strong>. Il achète des « têtes » vivantes pour la Faim et les galeries sans soleil — cheptel (réserve de sang) et main-d'œuvre. Diplomate glacial : il ne se bat pas, il marchande, et si l'affaire tourne mal il fuit pour prévenir les siens (une fuite réussie = la cité vampire se met sur ses gardes). C'est « la troisième personne » présente au point de transfert, escorté d'un <strong>Vampirien</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	12	15	12	16	14	18	\N	ce3fb962-bb73-47f4-8e12-656c0af3f4a1	\N	\N	MAN	CRIMINALITE	\N	\N	f	\N	\N	f	\N
b0586d35-df0d-4b81-8c0b-60d0a6ed634f	Taral de l'Est	<p>Homme, 36 ans, guerrier de niveau 9. Grand et massif, la carrure d'un porteur d'armure ; il se place systématiquement entre les jumelles et la porte, sans qu'on le lui demande.</p>\n<p>Visage large et impassible, teint mat, mâchoire carrée. Cheveux noirs coupés ras. Yeux noirs, attentifs. Un tatouage tribal de l'Est court sur la nuque, en partie caché par le col.</p>\n<p><strong>Voix :</strong> grave et rare, avec un accent de l'Est marqué sur les voyelles. Débit bref et strictement utilitaire : il annonce, prévient, et se tait. Parle aux jumelles avec une douceur que personne d'autre ne lui connaît.</p>\n<p><strong>Rôle :</strong> garde du corps personnel des jumelles <strong>Vanessa</strong> et <strong>Vanda Tomasio</strong> à Brodnica.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	MILITAIRE	{}	\N	f	\N	\N	f	\N
29f44204-2e22-4a66-9302-c6eb832ce530	Tarek l'Échangeur	<p>Homme humain d'âge moyen (~45 ans). Sec et vif, toujours debout à côté de son étal ; sacoche en bandoulière, il ne se sépare jamais de sa balance de troc.</p>\n<p>Teint tanné par le vent, moustache tressée de perles d'os. Manteau rapiécé de mille tissus différents pris en échange au fil des routes. Yeux marron rapides, qui évaluent un visiteur avant qu'il ait posé sa charge.</p>\n<p><strong>Voix :</strong> claire et chantante, rodée aux marchés de trois pays ; il change d'accent selon la provenance de son client, et en est très fier. Débit rapide et enjôleur, ponctué de proverbes de route dont il invente la moitié. Répète toujours l'offre de l'autre à voix haute avant de contre-proposer — pour lui laisser le temps d'entendre à quel point elle était basse.</p>\n<p><strong>Inventaire</strong> (prix indicatifs en po — il préfère très largement l'échange en nature) : ration de voyage (7 jours) 3 po ; outre d'eau renforcée 2 po ; corde en crin tressé (15 m) 4 po ; carte des steppes du nord, annotée à la main, 15 po ; silex enchanté (allume un feu même sous la pluie, usage illimité) 25 po ; amulette porte-bonheur beor khan (cosmétique) 8 po ; fiole de teinture de guerre (peinture rituelle, cosmétique) 5 po ; petit couteau d'os gravé 6 po.</p>	\N	8	12	10	13	11	14	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	MAN	MARCHAND	\N	\N	f	\N	\N	f	\N
b07ba914-3b3a-417c-bbfd-6198ee0bee38	Taripica Kinemor	<p>Femme, 41 ans, membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien. Petite et ronde, d'une vivacité qui tranche avec la raideur familiale.</p>\n<p>Visage plein, teint clair, fossettes. Cheveux blond cendré bouclés, difficilement disciplinés malgré les épingles. Yeux bleu pâle, rieurs. Beaucoup de bijoux, portés sans logique.</p>\n<p><strong>Voix :</strong> claire et volubile, avec l'accent pointu momoritanien qu'elle escamote quand elle s'emporte. Débit rapide et bavard, elle rit beaucoup et parle de tout le monde — c'est la seule Kinemor dont on apprenne quelque chose. Baisse d'un ton pour les confidences, ce qui lui arrive plusieurs fois par heure.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
c22ad785-5424-4bcd-a113-3f25c99894d3	Edrik Luneclaire	<p>Homme humain, 44 ans. De taille moyenne et parfaitement quelconque de silhouette — une neutralité qui paraît entretenue. Manteau de voyage gris, sans insigne.</p>\n<p>Visage fermé, aux traits réguliers et sans signe distinctif. Cheveux châtains coupés court, joues rasées de frais quelle que soit l'étape. Yeux noisette qui ne s'attardent jamais plus d'une seconde au même endroit.</p>\n<p><strong>Voix :</strong> unie, sans timbre remarquable, et surtout très rare — il peut traverser une soirée entière sans dire dix mots. Débit lent quand il s'y résout, chaque phrase construite d'avance et prononcée une seule fois. Ses interlocuteurs se surprennent à retenir leur souffle pendant les silences.</p>\n<p><strong>Rôle :</strong> messager et juge itinérant du <strong>Conseil d'Acier</strong>. Porte les ordres du Vrai Conseil d'une ville à l'autre. Parle rarement, mais ses mots ont force de loi.</p>\n<p><strong>Secret (MJ) :</strong> rumeur — il serait en contact avec le « <strong>Commissaire Inconnu</strong> », figure du Conseil suprême.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	12	35	f	4
67a5fa35-103d-4486-831e-078d56beedc9	Garran Cilovard	<p>Homme humain, 58 ans, patriarche <strong>Cilovard</strong>. Silhouette imposante — large d'épaules, encore droit malgré l'âge. Vêtements toujours sombres et d'excellente coupe, canne à pommeau d'argent qu'il n'utilise pas pour marcher.</p>\n<p>Visage taillé à la serpe, rides profondes aux commissures de la bouche et autour d'yeux gris clairs d'une fixité déconcertante. Cheveux gris acier coiffés en arrière avec une rigueur quasi militaire, sourcils épais encore sombres qui contrastent avec le reste. Une légère cicatrice verticale traverse son sourcil gauche.</p>\n<p><strong>Voix :</strong> profonde et froide, parfaitement maîtrisée, sans la moindre inflexion superflue — il n'élève jamais le ton, y compris pour menacer. Débit lent et articulé, avec une pause avant les sommes et les noms de famille, comme pour en souligner le poids. Ne répond jamais immédiatement : il laisse toujours passer deux secondes.</p>\n<p><strong>Rôle :</strong> directeur de la <strong>Couronne de Platine</strong>, ministre officieux des finances. Pragmatique, rigide, autoritaire.</p>\n<p><strong>Secret (MJ) :</strong> il a signé un contrat de garantie magique — en réalité un lien d'obéissance latent vers le <strong>Roi-Tyrannœil</strong>.</p>\n<p><strong>Capacités notables :</strong> CA 15 · PV 68 · Canne-épée +6. Persuasion +7, Tromperie +6, Intimidation +5. Sang-froid absolu (avantage contre peur et charme) ; Regard du créancier 1/jour (peur, DD 14).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	{}	\N	f	15	68	f	6
fa0063c9-958b-461c-b5ee-42fb880375bc	Gesouto Mastiggia	<p>Homme humain, 61 ans, aristocrate dolomitcien. Corpulent et lent, le pas lourd ; il s'appuie sur les meubles en traversant une pièce.</p>\n<p>Visage large et gras, teint olivâtre, bajoues naissantes. Cheveux noirs teints, ramenés en arrière et luisants. Yeux noirs, petits, presque enfouis. Bagues à trois doigts de chaque main.</p>\n<p><strong>Voix :</strong> grasse et sonore, avec un fort accent dolomitcien qu'il n'a jamais cherché à perdre — il le cultive, c'est sa signature. Débit lent et gourmand, il savoure ses propres phrases et attend qu'on rie de ses traits d'esprit. S'essouffle au bout de trois phrases et reprend son souffle bruyamment.</p>\n<p><strong>Rôle :</strong> domaine de la Porte Pourpre. Ligne « <strong>Chaînes du Sang</strong> », clan <strong>Izotzargi</strong> (Partie 5).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	1afe313c-9ddc-445a-a189-57a654ac067b	HUMAIN	MAN	\N	\N	\N	f	\N	\N	f	\N
3fd5bad4-7fd4-4c2e-9843-4b3e84867301	Grena Dov	<p>Femme humaine, 52 ans, robuste. Large d'épaules et solidement plantée derrière son comptoir, avant-bras nus quelle que soit la saison.</p>\n<p>Cheveux gris tressés en une natte unique ramenée sur l'épaule ; regard perçant, yeux marron qui évaluent un client avant qu'il ait ouvert la bouche. Visage large, mâchoire volontaire, quelques rides de rire qui démentent le reste.</p>\n<p><strong>Voix :</strong> ample et rauque, qui couvre la salle sans effort et coupe court aux disputes. Débit sec, phrases courtes, aucune politesse inutile. Tutoie tout le monde d'emblée, et vouvoie exactement ceux qu'elle méprise.</p>\n<p><strong>Rôle :</strong> patronne et tenancière du <strong>Poids Juste</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	c287aadd-d73e-43b5-8223-813e59ed8350	HUMAIN	WOMAN	\N	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	12	28	f	1/2
f0974caa-af4e-47c0-b94b-9fdaeb629ec0	Gundath	<p>Homme goliath, 37 ans. Immense et large, deux mètres et des poussières, la cage thoracique d'un homme qui vit de son souffle. Se tient toujours un peu voûté sous les plafonds d'Alagir, faits pour d'autres.</p>\n<p>Peau gris-bleu marbrée des motifs claniques goliaths, crâne chauve et tatoué de lignes verticales qui descendent sur la nuque. Yeux clairs, presque blancs. Mâchoire large, dents très régulières.</p>\n<p><strong>Voix :</strong> son instrument et sa raison d'être. Basse profonde, d'une puissance qui fait vibrer les verres sur les tables — et surtout, il pratique le <strong>chant polyphonique</strong> : il tient deux notes à la fois, un bourdon grave dans la gorge et une mélodie sifflée au-dessus, si bien qu'on cherche du regard le second chanteur. En parlant, le débit est lent et grave, presque solennel ; il fait des phrases courtes, et laisse toujours résonner la dernière syllabe.</p>\n<p><strong>Rôle :</strong> barde goliath spécialisé dans le chant polyphonique.</p>	\N	10	10	10	10	10	18	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	GOLIATH	MAN	\N	{COMMUN,GEANT}	\N	f	13	40	f	2
bee18153-fe3c-4ffd-8e30-6e91eb31db5e	Harl Denvar	<p>Homme demi-orc, 42 ans. Musculature saillante, visible sur les avant-bras et par l'entrebâillement de sa chemise, zébrée par des années de bataille. Chemise bouffante blanche, pantalon marron.</p>\n<p>Peau verte, visage carré avec deux crocs proéminents, entourés d'une petite moustache et d'un bouc finement taillés. Yeux jaune perçant. Dégradé militaire s'achevant par des cheveux plus longs sur le dessus, plaqués en arrière, noirs striés de gris. Porte les marques d'un duel dans les carrières.</p>\n<p><strong>Voix :</strong> grave et posée, avec le calme d'un vétéran qui n'a plus rien à prouver ; elle ne monte que sur le terrain d'entraînement, et alors elle claque. Débit mesuré, il écoute plus qu'il ne parle et laisse volontiers un silence s'installer pour voir ce que l'autre y mettra — réflexe d'espion autant que de garde du corps.</p>\n<p><strong>Rôle :</strong> confident et garde du corps de <strong>Daren Tovalis</strong>. Vétéran du <strong>Soleil Pourpre</strong> à la retraite.</p>\n<p><strong>Secret (MJ) :</strong> il espionne discrètement les réunions du Soleil Pourpre pour Daren. A entendu des officiers employer « <strong>Rayon</strong> » comme salut codé, et compile un dossier secret intitulé « <em>Les Yeux dans la pierre</em> ». Partie 5 : test de garde de l'écaille ; quête d'infiltration de la soirée Regalio/Marcheto ; récompense de La Loutre SAOUL.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	DEMI_ORC	MAN	\N	{}	\N	f	15	85	f	5
e7b4e596-3071-41cf-ae15-4501a6a3b167	Hilden Drosh	<p>Homme humain, 47 ans. Petit et rond, les épaules perpétuellement remontées ; il sursaute quand la porte de la boutique s'ouvre.</p>\n<p>Crâne luisant et dégarni, quelques mèches ramenées en travers. Visage rouge et moite, bajoues tremblotantes. Yeux marron inquiets qui vont sans arrêt de l'interlocuteur à l'entrée. Une plume derrière l'oreille, toujours la même, et de l'encre sur la tempe à force de la remettre.</p>\n<p><strong>Voix :</strong> haut perchée et pressée, qui déraille dans l'aigu dès qu'il s'énerve. Débit en cascade, il pose trois questions avant d'écouter la réponse à la première. Répète « c'est cela, c'est cela » en se frottant les mains.</p>\n<p><strong>Rôle :</strong> patron du <strong>Calepin Ébréché</strong>. Cherche qui a écrit un document qui n'existe pas.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	1688db92-616d-4198-ad53-a0be9ceedcba	HUMAIN	MAN	\N	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	11	18	f	1/4
3a3880bc-3274-4229-a6e5-08dc14789e11	Ikar Doven	<p>Homme humain, 39 ans. Sec et dur, tout en nerfs sous l'armure ; il garde son casque le plus longtemps possible, y compris à l'intérieur.</p>\n<p>Sous le casque pourpre, le visage est marqué par les brûlures — la joue et la tempe gauches ont fondu puis mal cicatrisé. Cheveux bruns rasés d'un côté. Le regard paraît étrangement vide, sans que ce soit de la bêtise.</p>\n<p><strong>Voix :</strong> plate et sans relief, comme si la conviction avait été retirée des mots mais pas les mots eux-mêmes. Débit récitatif, il reprend le vocabulaire des officiers à la lettre — les slogans du Soleil Pourpre sortent de lui sans qu'il paraisse les penser. Sa voix ne retrouve un timbre normal que lorsqu'il parle de la Cinquième Roue, où il est né.</p>\n<p><strong>Rôle :</strong> Centurion Pourpre. Né à la Cinquième Roue, ancien voleur repenti.</p>\n<p><strong>Particularité :</strong> fanatique mais survivant, prêt à tout pour conserver son statut.</p>	\N	16	16	14	12	13	12	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	MAN	MILITAIRE	{COMMUN,ARGOT_VOLEUR}	\N	f	17	78	f	5
41bd801c-d53a-4ec3-9aed-c4032372297a	Isha Ka	<p>Femme tieffeline, 43 ans, à la peau cendrée. Mince et souple, gestes lents et circulaires ; elle se déplace dans sa boutique sans jamais heurter un flacon.</p>\n<p>Yeux dorés ; tatouages runiques sur la gorge ; bijoux d'os et anneaux serpentins. Cornes fines ramenées en arrière, ornées de fil d'argent.</p>\n<p><strong>Voix :</strong> douce, légèrement sifflante, avec un traînement sur les « s » qui donne à chaque phrase un tour d'incantation. Débit très lent, beaucoup de silences ; elle laisse ses clients terminer leurs propres phrases à sa place. « <em>Chaque parfum a une intention, chaque poison une poésie.</em> »</p>\n<p><strong>Rôle :</strong> tient <strong>Le Souffle d'Obsidienne</strong>.</p>\n<p><strong>Particularité :</strong> son faucon translucide <strong>Voriel</strong> est un fragment de son pouvoir vital — si Voriel meurt, elle s'effondre.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	e61af0df-fecc-48a5-993b-d8f36ef79021	TIEFFELIN	WOMAN	\N	\N	\N	f	13	45	f	3
7633faa3-0a05-46c2-84ef-2af359ecddbd	Jillian Riverpipe	<p>Femme, la quarantaine. Petite et vive, toujours en mouvement ; elle parle en marchant et fait tourner ses interlocuteurs autour d'une table sans qu'ils s'en aperçoivent.</p>\n<p>Visage rond et mobile, fossettes marquées, teint clair semé de taches de rousseur. Cheveux roux foncé remontés à la va-vite et piqués d'un crayon. Yeux verts extrêmement rapides, qui relèvent tout.</p>\n<p><strong>Voix :</strong> chaleureuse et enjouée, faite pour mettre à l'aise — c'est son principal outil de travail. Débit rapide et enveloppant, plein de « mon cher » et de rires placés au bon endroit ; elle pose trois questions anodines pour en glisser une quatrième qui compte. Quand la négociation devient sérieuse, le rire disparaît d'un coup et le débit ralentit de moitié.</p>\n<p><strong>Rôle :</strong> courtière d'Alagir, pivot dans les cercles d'affaires et d'influence de la ville. Liée au <strong>Syndicat d'Alagir</strong> et à <strong>La Braise</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste compatible avec plusieurs.</em></p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	WOMAN	MARCHAND	{}	\N	f	\N	\N	f	\N
87d809bb-833e-4fa4-8dff-17e9cd7f3af3	Lady Serenya Palhindile	<p>Femme haute elfe, 310 ans, matriarche <strong>Palhindile</strong>. Grande, d'une beauté hors du temps qui porte ses siècles comme une seconde nature. Toujours vêtue de blanc et d'argent, rapière fine et ouvragée à la ceinture.</p>\n<p>Cheveux d'or blanc nattés avec des fils d'argent et des perles de verre coloré. Yeux vert clair aux pupilles en amande oblongue, regard d'une sérénité absolue qui peut en une fraction de seconde devenir d'acier. Peau de porcelaine aux veines légèrement irisées, traits d'une symétrie parfaite.</p>\n<p><strong>Voix :</strong> limpide et musicale, d'une éloquence sans faille — trois siècles de médiation lui ont donné une diction que personne n'interrompt. Débit ample et régulier, avec des phrases longues qui ne se perdent jamais ; elle ne reprend jamais un mot. Quand elle veut clore un débat, elle ne hausse pas le ton : elle ralentit jusqu'au silence, et la salle se tait avec elle.</p>\n<p><strong>Rôle :</strong> Chancelière d'Alagir. Calme, bienveillante.</p>\n<p><strong>Secret (MJ) :</strong> elle consigne chaque nuit, depuis son balcon, les lumières qui bougent sur l'excavation. Sans le savoir, ses carnets tracent les itinéraires des convois nocturnes vers la <strong>Citadelle Rouge</strong>.</p>\n<p><strong>Capacités notables :</strong> CA 15 · PV 56 · Rapière +5. Persuasion +8, Intuition +6, Religion +5. Aura de paix (alliés proches avantagés contre la peur) ; Verre protecteur 1/jour (Apaisement ou Zone de vérité).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	ELFE	WOMAN	\N	{}	\N	f	15	56	f	7
1e0c5487-24ff-4d0c-8b7e-e71cafc7345e	Laguna Temper	<p>Femme gnome, 158 ans, 84 cm. Menue et anguleuse, perchée sur un tabouret trop haut qu'elle ne quitte pratiquement jamais ; les pieds ne touchent pas le sol et ça ne la gêne pas.</p>\n<p>Cheveux roux rasés côté gauche, le reste tombant en mèches inégales. Yeux noirs, très brillants. Visage pointu, nez fin, une pincée de poudre de cristal restée dans un sourcil.</p>\n<p><strong>Voix :</strong> haut perchée et râpeuse, avec un petit claquement de langue entre les propositions. Débit rapide et sautillant, plein de parenthèses dont elle ne ressort pas toujours ; elle change d'idée en cours de phrase et garde les deux. Récite les montants dus d'une traite, sans respirer et sans se tromper d'un cuivre.</p>\n<p><strong>Rôle :</strong> sorcière gnome (niveau 4), spécialiste de <strong>cristomancie</strong>. Renvoie vers l'atelier d'<strong>Amiro Léovine</strong> après la dette de <strong>Folduin</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	66c5d788-a8da-4096-82a8-5f7089e6a657	GNOME	WOMAN	\N	\N	\N	f	12	22	f	2
216d16e4-dc88-45be-95bf-aa4469195ae3	Lierin Lorial	<p>Homme, 57 ans. Grand et corpulent, port solennel ; il entre dans une pièce en dernier et s'y installe comme chez lui.</p>\n<p>Visage large et soigné, rasé de près, teint clair de quelqu'un qui ne sort qu'en voiture. Cheveux gris coupés court et coiffés à la brosse. Yeux bleus froids, paupières lourdes. Une chevalière massive qu'il fait tourner quand on lui déplaît.</p>\n<p><strong>Voix :</strong> ample et grave, posée sur un registre d'autorité tranquille ; il parle comme on énonce un règlement. Débit lent et solennel, avec des pauses appuyées avant les chiffres. Reprend systématiquement les erreurs de vocabulaire de ses interlocuteurs — « on dit <em>créance</em> » — avant de répondre au fond.</p>\n<p><strong>Rôle :</strong> prévôt bancaire d'Alagir, influent dans le réseau financier de la cité. Dirige <strong>La Ligature Bancaire d'Alagir</strong>, avec <strong>Ery Seel</strong> pour bras droit.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche.</em></p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
381eb3b5-c442-4fce-9388-e6df91d76f56	Lior Palhindile	<p>Homme demi-elfe, 24 ans, mage archiviste <strong>Palhindile</strong>. Jeune et mince, légèrement voûté sur les tables de travail. Robe d'archiviste bleu nuit un peu usée aux coudes.</p>\n<p>Traits mélangés — oreilles très légèrement pointues, visage plus doux et expressif qu'un elfe pur. Cheveux brun-roux mi-longs, toujours légèrement ébouriffés comme s'il venait de les sortir d'un livre. Yeux d'un vert lumineux aux reflets elfiques. Lunettes rondes à monture de laiton fin perchées sur le nez. Doigts toujours tachés d'encre noire ou violette.</p>\n<p><strong>Voix :</strong> jeune et claire, qui s'anime et accélère dès qu'il parle de vitraux ou de langues anciennes — il devient alors difficile à suivre et s'en excuse ensuite. Débit hésitant sur tout le reste, semé de « enfin, je veux dire » et de reprises. Lit à mi-voix quand il croit être seul.</p>\n<p><strong>Rôle :</strong> spécialiste des vitraux anciens.</p>\n<p><strong>Secret (MJ) :</strong> il a trouvé sous son atelier une dalle de verre gravée d'un plan oublié des souterrains d'Alagir — il n'ose dire à qui il mène.</p>\n<p><strong>Capacités notables :</strong> CA 12 · PV 33 · Bâton +3. Sorts mineurs : Lumière, Prestidigitation, Détection de la magie. Niveaux 1–2 : Bouclier, Identification, Silence, Détection du mal et du bien. Archiviste du silence (avantage pour les langues anciennes).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	DEMI_ELFE	MAN	\N	{}	\N	f	12	33	f	3
d0556534-e9cd-4984-9336-2bfc2d65330d	Lira Morven	<p>Femme humaine, 41 ans. Grande et solide, elle se tient toujours droite — une raideur de garde qui ne l'a pas quittée avec le poste. Armure polie sans ornement.</p>\n<p>Visage sévère et régulier, mâchoire nette, cheveux noirs noués serré. Yeux gris qui soutiennent le regard trop longtemps. Une ride verticale entre les sourcils, creusée depuis un an.</p>\n<p><strong>Voix :</strong> nette et ferme, habituée au commandement, avec la diction claire de quelqu'un qui donne des ordres qu'on ne doit pas faire répéter. Débit régulier, sans emphase. Depuis ce qu'elle a vu, elle s'interrompt parfois au milieu d'une phrase, regarde ailleurs, puis reprend exactement où elle s'était arrêtée.</p>\n<p><strong>Rôle :</strong> <strong>Radius Ignis</strong> du <strong>Soleil Pourpre</strong>, ancienne capitaine de la Porte Pourpre. Connue pour sa droiture absolue. Classe : paladine déchue.</p>\n<p><strong>Secret (MJ) :</strong> elle est hantée par ce qu'elle a vu du vrai visage du Roi.</p>\n<p><strong>Capacités notables :</strong> Espadon du Serment Rouge +1, infligeant des brûlures éthériques.</p>	\N	18	12	16	11	14	16	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	WOMAN	MILITAIRE	{COMMUN}	\N	f	18	110	f	7
0622d84c-e5c2-4c64-bac5-74479683daee	Lord Calen Palhindile	<p>Homme humain, 62 ans, époux de <strong>Serenya</strong>. Grand mais légèrement voûté, comme plié par des décennies passées sur des parchemins. Porte presque toujours un livre ou un rouleau sous le bras. Vêtements riches dans leurs matières mais usés aux coudes et aux poignets par l'érudition quotidienne.</p>\n<p>Cheveux blancs fins et doux, barbe soignée d'un blanc immaculé. Yeux bleus fanés mais curieux, lumineux dès qu'on évoque l'histoire ou la religion. Visage ridé avec bonhomie — rides de sourire plus que de souci.</p>\n<p><strong>Voix :</strong> chaude et légèrement chevrotante, celle d'un conteur qui a longtemps enseigné. Débit digressif : il part sur une parenthèse historique au milieu d'une réponse et revient dix minutes plus tard, ravi, sans que personne ait pu l'arrêter. Cite toujours ses sources, y compris dans une conversation de couloir.</p>\n<p><strong>Rôle :</strong> ancien ambassadeur à <strong>Huriya</strong> et au <strong>Saint-Empire</strong>. Érudit passionné d'histoire des religions.</p>\n<p><strong>Secret (MJ) :</strong> il détient une correspondance chiffrée de son temps d'ambassadeur, prouvant qu'un traité d'Alagir a été monnayé — un levier qu'il refuse d'utiliser.</p>\n<p><strong>Capacités notables :</strong> CA 13 · PV 42 · Bâton +4. Religion +6, Perspicacité +5, Persuasion +5. Savoir perdu (avantage en Histoire sur les traces de cultes anciens).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	{}	\N	f	13	42	f	5
e945a71d-9224-4272-8f9a-c6a775c22110	Lorian Cilovard	<p>Homme humain, 32 ans, fils aîné <strong>Cilovard</strong>. Taille moyenne, allure de voyageur aisé — ni trop mince ni trop épais, corps habitué aux traversées maritimes. Toujours soigné sans être ostentatoire ; bague de cachet gravée aux armoiries Cilovard à la main droite.</p>\n<p>Cheveux bruns ondulés coiffés vers l'arrière, court bouc bien taillé qui vieillit légèrement son visage. Yeux noisette expressifs et rapides à évaluer son interlocuteur.</p>\n<p><strong>Voix :</strong> assurée et agréable, un baryton de salon qu'il module selon l'interlocuteur — plus rond avec les marchands, plus sec avec les capitaines. Débit fluide et rapide, avec une habitude de reformuler la position adverse avant de la démonter. Glisse des mots de gandorenne et de dolomicien pour signaler qu'il a voyagé.</p>\n<p><strong>Rôle :</strong> responsable des échanges extérieurs et du commerce maritime. Ambitieux, érudit en diplomatie économique.</p>\n<p><strong>Secret (MJ) :</strong> après un traité avec <strong>Gandorènne</strong>, il a vu un reflet rouge dans l'encrier — manifestation du Roi observant la transaction.</p>\n<p><strong>Capacités notables :</strong> CA 14 · PV 46 · Dague +4. Persuasion +6, Investigation +5, Intimidation +5.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	{}	\N	f	14	46	f	4
55ab84f0-5613-4c07-a940-0cf0ed52efd8	Lorn	<p>Homme humain, 48 ans. Colosse manchot — le bras droit sectionné au-dessus du coude, la manche repliée et épinglée avec soin. Épaules et nuque encore massives malgré les années de comptoir.</p>\n<p>Visage large et fermé, nez épaté, crâne tondu. Barbe grise de trois jours. Yeux marron sans expression particulière. Plusieurs cicatrices blanches sur le cuir chevelu.</p>\n<p><strong>Voix :</strong> grave et rare, elle sort rarement au-dessus du grognement ; il répond par monosyllabes et laisse les clients combler le vide. Débit lent, avec un temps d'arrêt avant chaque réponse, comme s'il vérifiait la question. Ne dit jamais « non » — il pose simplement le chiffon et regarde.</p>\n<p><strong>Rôle :</strong> ex-soldat <strong>Tovalis</strong>, tient le comptoir de <strong>La Roue de Secours</strong>. Le nettoie d'une main, avec une rigueur maniaque.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	ab0c8d88-3f3b-41cc-809f-3cde159f2fad	HUMAIN	MAN	\N	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	14	45	f	2
6a5b7b66-69da-4d52-ae5c-429c06c4e922	Mada Lure	<p>Femme humaine, 79 ans, vieille et ridée. Petite et tassée, le dos rond ; elle se déplace lentement et s'assoit dès qu'elle le peut, à la meilleure table de la salle.</p>\n<p>Visage profondément ridé, joues creuses, bouche sans lèvres. Cheveux blancs rares, ramassés sous un fichu sombre. Yeux noirs enfoncés, d'une vivacité qui dément le reste. Une <strong>clé pendue au cou</strong>, qu'elle ne quitte jamais.</p>\n<p><strong>Voix :</strong> éraillée et basse, avec un chuintement sur les sifflantes — il faut se pencher pour l'entendre, et c'est très exactement le but. Débit très lent, entrecoupé de pauses qu'elle laisse durer pour voir qui les comblera. Ne pose jamais de question directe : elle énonce un fait à moitié, et attend qu'on le complète.</p>\n<p><strong>Rôle :</strong> entremetteuse entre syndicalistes, prêtres de <strong>Tal Odius</strong> et espions, à <strong>L'Auberge du Murmure</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	a5cb4ff0-5ca6-435c-b0c9-8efa963114ff	HUMAIN	WOMAN	\N	\N	de27c25a-119c-4435-a163-59bdc7240279	f	11	18	f	1/4
e40dc39d-150f-4f7b-ba94-1b13f0526ec0	Madame Solinne	<p>Femme demi-elfe, 68 ans (elle en paraît quarante). Silhouette ample et fluide sous les voiles blancs, démarche lente et nonchalante dans la vapeur des bains.</p>\n<p>Traits adoucis par l'hérédité elfique, peau claire et lisse, cheveux blond cendré relevés en désordre étudié. <strong>Yeux verts hypnotiques</strong>, à la fixité un peu trop longue. Toujours drapée de voiles blancs, jamais tout à fait fermés.</p>\n<p><strong>Voix :</strong> feutrée et chaude, à peine plus forte que le bruit de l'eau — on l'entend pourtant parfaitement, ce qui n'a jamais été expliqué. Débit très lent, chaque phrase étirée, avec des fins suspendues qui invitent à répondre. Ne dit jamais « vous » : elle dit « mon cœur », à tout le monde, du premier échange.</p>\n<p><strong>Rôle :</strong> maîtresse des bains, aux <strong>Vapeurs d'Olena</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	52c62675-fc63-422a-9a18-ec13ca8256b8	DEMI_ELFE	WOMAN	\N	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	13	35	f	2
b9a0b7ee-5455-466d-86c0-12363226b383	Maerin Tovalis	<p>Femme humaine, 27 ans, héritière <strong>Tovalis</strong>. Grande et athlétique, le teint hâlé de quelqu'un qui passe ses journées sur les quais et les barges. Mains légèrement calleuses, une entaille récente cicatrisée à l'index. Tenue pratique mais bien coupée, toujours une carte de navigation pliée dans la poche.</p>\n<p>Cheveux châtain foncé coupés aux épaules, souvent relevés en chignon pratique pour travailler. Yeux verts clairs, regard direct et sans détour.</p>\n<p><strong>Voix :</strong> claire et projetée, une excellente oratrice qui sait se faire entendre d'un quai à l'autre sans crier. Débit vif et structuré — elle annonce combien de points elle va faire, puis les fait. Coupe court aux formules de politesse d'un « venons-en au fret » qui a fait sa réputation.</p>\n<p><strong>Rôle :</strong> gère les contrats de transport fluvial sur l'<strong>Artère Azur</strong>. Dispose d'une flotte de 12 barges et 4 entrepôts sous douane. Ambitieuse et vive, elle cherche à moderniser et à ouvrir des partenariats avec <strong>Huriya</strong>.</p>\n<p><strong>Secret (MJ) :</strong> elle ignore les secrets de son père, mais remarque les incohérences du <strong>Soleil Pourpre</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	{}	\N	f	12	38	f	2
2ac16f69-2071-4585-ba34-c47f54e856d9	Marja la Cicatrice	<p>Femme humaine, 44 ans. Râblée et puissante, la démarche chaloupée d'une ancienne combattante d'arène ; elle se tient toujours au bord du sable, jamais dessus.</p>\n<p>Visage dur, pommettes hautes, cheveux noirs rasés sur les côtés. La <strong>cicatrice</strong> qui lui vaut son nom part de l'oreille gauche et traverse la joue jusqu'au coin de la bouche, tirant son sourire vers le haut en permanence. Yeux noirs, sourcils épais.</p>\n<p><strong>Voix :</strong> puissante et éraillée, dressée à couvrir une foule qui hurle ; elle annonce les combats sans avoir besoin de crier. Débit rythmé, presque scandé, avec un goût du suspense sur le dernier mot. En privé, elle tombe à un filet de voix très calme — et c'est là qu'on a peur.</p>\n<p><strong>Rôle :</strong> maîtresse de l'<strong>Arène du Goulet Écarlate</strong>, pour le <strong>Syndicat d'Alagir</strong>. Enregistre tous les gages d'honneur.</p>\n<p><strong>Secret (MJ) :</strong> spectacle et chantage.</p>\n<p><strong>Capacités notables :</strong> CA 15 · PV 40 · Couteau +6. Intimidation +7.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	0a7bd954-949d-479c-9d26-522c76b65a49	HUMAIN	WOMAN	\N	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	15	40	f	3
82991204-d47e-455e-b632-78371f6ae52f	Mava Roen	<p>Femme gnome, 112 ans. Menue et compacte, parfaitement immobile derrière son guichet ; on ne la voit jamais ni entrer ni sortir de la Place Sombre.</p>\n<p>Visage rond et sans expression, teint clair. Cheveux gris-bleu coupés au carré, impeccablement réguliers. Yeux gris très pâles derrière des besicles rectangulaires. Manchettes noires pour protéger les poignets de l'encre.</p>\n<p><strong>Voix :</strong> basse et neutre, volontairement inintéressante — elle a fait de la banalité un outil de discrétion. Débit régulier et bref, uniquement des faits et des numéros ; elle ne prononce jamais le nom d'un déposant à voix haute, même seule dans la salle. Termine chaque échange par « c'est noté », qui vaut acquittement.</p>\n<p><strong>Rôle :</strong> directrice de place de la <strong>Caisse des Richesses Cachées</strong> (C.C.R.C.), Place Sombre. Prudente, secrète et très efficace dans la gestion des coffres individuels anonymisés.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	GNOME	WOMAN	\N	\N	\N	f	11	18	f	2
abc00e5f-0814-4aa4-abae-3c7c81b136aa	Maître Alyenra Verth	<p>Elfe, apparence d'une trentaine d'années pour un âge bien supérieur. Longiligne et très droit de maintien, les mains toujours visibles et posées à plat. Robe à motifs de vitraux, gants de soie runique jamais ôtés.</p>\n<p>Teint pâle, presque translucide. Cheveux lilas lisses, séparés au milieu et tombant sous l'épaule. Yeux couleur opale, dont l'iris semble tourner lentement selon la lumière. Traits d'une régularité sans chaleur.</p>\n<p><strong>Voix :</strong> lente, d'une diction parfaite, chaque syllabe détachée comme si elle était gravée. Débit posé et sans hésitation, avec une <strong>ironie feutrée</strong> qui ne se signale par aucun changement de ton — on ne comprend la pique qu'une phrase plus tard. « <em>Une rune mal tracée, c'est comme une promesse mal tenue : ça explose toujours au mauvais moment.</em> »</p>\n<p><strong>Rôle :</strong> tient <strong>Les Runes de Verre</strong>. Garde le <strong>Fragment du Vitrail Brisé</strong> derrière un sort de miroir inversé.</p>\n<p><em>Note MJ : son genre n'est pas établi en fiche — la description reste neutre.</em></p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	36d4d3fa-c366-4cb4-8486-2bc72fb283bb	ELFE	\N	\N	\N	\N	f	13	40	f	2
2b1aab71-b65d-4ff1-b3cd-fbb968ed1411	Maître Ulric Brumel	<p>Homme demi-orc, la soixantaine, maigre et légèrement voûté — le dos plié par vingt ans de registres. Mains longues, doigts tachés d'encre jusqu'aux cuticules. Costume sombre en laine dolomicienne, gilet boutonné jusqu'au col, cachet de cire suspendu à une chaîne plate ; il sent la cire d'abeille et le vieux cuir.</p>\n<p>Peau pâle, grise de poussière de papier ; cheveux gris peignés avec une raie d'une rectitude militaire, favoris minutieusement taillés ; yeux châtains myopes et plissés, petites lunettes rondes à monture d'étain qu'il essuie sans cesse.</p>\n<p><strong>Voix :</strong> ténue et courtoise, un peu nasale, sans la moindre trace du grondement qu'on attend d'un demi-orc — et il en joue, car on le sous-estime. Débit lent et scrupuleux, il mesure chaque mot et se reprend pour préciser une date ou un numéro de liasse. S'excuse avant de contredire, puis contredit avec une exactitude implacable.</p>\n<p><strong>Rôle :</strong> secrétaire particulier et archiviste de la maison <strong>Rigart</strong>, bras droit d'<strong>Eldric Rigart</strong> pour la paperasse, les contrats fluviaux et la correspondance avec les <strong>Cilovard</strong>. N'a jamais mis les pieds sur un ponton sans escorte.</p>\n<p><strong>Personnalité :</strong> bureaucrate jusqu'au bout des doigts — poli, méthodique, prudent. Évite les quais, les disputes et tout ce qui ressemble à une aventure ; connaît les numéros de liasse par cœur. Loyal envers Eldric, mais infiniment plus à l'aise avec un registre qu'avec une épée.</p>	\N	8	9	10	15	14	11	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	fac35b8f-767d-466f-8ecf-5329226a4653	DEMI_ORC	MAN	MARCHAND	{}	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	\N	f	\N
4b898112-8241-4622-986f-b38d364315ae	Maître Verel	<p>Homme humain, 48 ans. De taille moyenne, très mince, d'une immobilité de statue derrière sa table ; seules ses mains bougent, et elles ne s'arrêtent jamais.</p>\n<p>Le visage est dissimulé par un <strong>masque</strong> de laque noire couvrant le haut jusqu'à la lèvre supérieure. On ne voit que la bouche, mince et pâle, et le menton rasé. Cheveux châtains ramenés en catogan. Mains fines et très soignées, ongles polis.</p>\n<p><strong>Voix :</strong> <strong>douce et dangereuse</strong> — un timbre bas, presque affectueux, qui ne change pas d'un souffle qu'il annonce un gain ou une ruine. Débit lent et régulier, cadencé sur le rythme des cartes qu'il distribue. Appelle chaque joueur « l'ami », et ceux qui l'entendent le dire deux fois dans la même phrase quittent la table.</p>\n<p><strong>Rôle :</strong> croupier masqué de <strong>La Vigne Noire</strong>, pour le <strong>Syndicat d'Alagir</strong> — et relais de <strong>L'Œil Pourpre</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	13	36	f	3
e13c1d51-c23d-470d-a222-38bd035041c0	Mirdobas Filan	<p>Homme humain, 54 ans. Mince et de taille moyenne, d'une immobilité déconcertante ; il garde les mains croisées devant lui et ne gesticule jamais en parlant.</p>\n<p>Visage étroit et lisse, presque sans rides pour son âge. Cheveux noirs coupés court, tempes grisonnantes. Yeux gris très clairs, d'une fixité qui ne cille pas assez — ceux qui l'ont soutenue longtemps disent ensuite avoir oublié pourquoi ils regardaient.</p>\n<p><strong>Voix :</strong> son arme. Douce, basse, d'une chaleur bienveillante parfaitement calibrée — <strong>elle instille des idées qui semblent naître dans l'esprit même de ses victimes</strong>. Débit lent et régulier, presque berçant, avec des répétitions discrètes qui reviennent trois phrases plus loin sans qu'on s'en aperçoive. Il ne donne jamais d'ordre : il formule une question dont la réponse est l'ordre.</p>\n<p><strong>Rôle :</strong> <strong>Radius Ignis</strong> du <strong>Soleil Pourpre</strong> et officier de liaison avec <strong>L'Œil Pourpre</strong>. Spécialiste du contrôle mental, de l'effacement de mémoire et de la réécriture de personnalité. Réunion secrète chez <strong>Regalio Regani</strong> (9 juin 887) : préparatifs de la Crypte Rubis, cadence des écailles, canalistes d'aplanissement émotionnel, surveillance des quais Arrezo. Ses interlocuteurs le nomment le plus souvent « Radius Ignis Mirdobas ».</p>\n<p><strong>Capacités notables :</strong> Présence Altérante, Maître des Esprits, Voile de l'Oubli, Frappe Psychique, Injection d'Idée, Fragmentation de l'Esprit, Effacement de Personnalité.</p>	\N	10	14	16	18	16	20	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	555b341a-0b2c-4983-8c51-186d9adde148	HUMAIN	MAN	MILITAIRE	{COMMUN,ELFIQUE,TELEPATHIQUE}	\N	t	15	135	f	9
8bee4975-3867-46b2-92dc-b0aadd21b17d	Narboki Runrock	<p>Homme nain, 88 ans. Large et bedonnant, la carrure tassée par des décennies penchées sur des fourneaux ; il s'essuie les mains sur son tablier toutes les deux minutes.</p>\n<p>Visage rouge et luisant, barbe rousse tressée en trois nattes courtes, retenues par des anneaux de cuivre. Yeux marron chafouins, qui regardent toujours un peu à côté. Sourcils brûlés d'un seul côté.</p>\n<p><strong>Voix :</strong> râpeuse et volubile, portée par le souffle court d'un homme qui parle en travaillant. Débit précipité et flatteur devant les maîtres de maison, franchement gouailleur dès qu'ils ont le dos tourné. Baisse la voix et regarde les issues quand il évoque un prix — c'est le moment où il ment.</p>\n<p><strong>Rôle :</strong> cuisinier du manoir <strong>Regani</strong>. Peut aider à infiltrer la soirée — moyennant finance, et sans garantie : il est peu fiable.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	0def10a3-503b-47b2-9ef3-45c42ef5bc28	NAIN	MAN	\N	\N	\N	f	\N	\N	f	\N
3037c0fe-d341-42a8-8eaa-3706786a5ed2	Regalio Regani	<p>Homme humain, 43 ans, nobliau dolomitcien de 3<sup>e</sup> ordre. De taille moyenne et un peu mou, épaules rondes que la coupe de ses vestes tente de corriger.</p>\n<p>Visage poupin et poudré, joues rasées de trop près. Cheveux bruns bouclés soigneusement arrangés, déjà clairsemés au sommet. Yeux marron toujours en quête d'approbation. Trop de bagues.</p>\n<p><strong>Voix :</strong> haute et flagorneuse, d'un enthousiasme permanent qui fatigue au bout de dix minutes. Débit rapide et flatteur, saturé de superlatifs ; il rit avant ses propres traits d'esprit. Le timbre se brise d'un demi-ton quand il s'adresse à quelqu'un de l'<strong>Œil Pourpre</strong> — un tic que ses invités prennent pour de la déférence mondaine.</p>\n<p><strong>Rôle :</strong> couverture artistique et officier de liaison entre l'<strong>Œil Pourpre</strong> et les Duchés. Hôte de <strong>Marcheto Spazi</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	0def10a3-503b-47b2-9ef3-45c42ef5bc28	HUMAIN	MAN	\N	\N	\N	f	\N	\N	f	\N
42d6a572-ed00-400a-8780-c2ce8d967481	Risa d'Olven	<p>Femme humaine, 38 ans. Sèche et musclée, épaules carrées ; elle porte le casque de carrière même pour traverser un bureau.</p>\n<p>Visage anguleux couvert d'une poussière pourpre qui ne part jamais complètement des plis. Cheveux noirs tressés serré sous le casque. Yeux gris clair, très pâles dans un visage sale. Une main gauche à laquelle il manque l'auriculaire.</p>\n<p><strong>Voix :</strong> forte et brève, calibrée pour les galeries où l'écho brouille tout — elle répète systématiquement chaque consigne deux fois, réflexe de sécurité. Débit sec, sans adjectifs. Se tait complètement et lève la main quand elle veut écouter la roche, et tout le monde se tait avec elle.</p>\n<p><strong>Rôle :</strong> maîtresse-carrière des <strong>Géodes Pourprées</strong> — galeries en cloche, dômes naturels scintillants. Rumeurs de xorns aperçus dans les profondeurs : elle a renforcé la sécurité des accès.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	\N	\N	f	12	38	f	3
c132e383-cfff-4c2d-a4c5-c03c7cf22527	Sahi "Lame-Cramoisie"	<p>Femme humaine, 40 ans. Athlétique et compacte, la démarche économe d'une officière de terrain ; elle ne s'assoit qu'en fin de rapport.</p>\n<p>Visage carré et hâlé, cheveux auburn coupés court et rasés sur la nuque. Yeux marron directs. Une longue cicatrice claire le long de l'avant-bras droit, qu'elle ne cache pas. Armure d'ordonnance impeccablement entretenue.</p>\n<p><strong>Voix :</strong> claire et tranchante, projetée sans effort, faite pour les ordres brefs en rue étroite. Débit rapide et structuré, en points numérotés ; elle répète l'essentiel à la fin. Une seule inflexion la trahit : elle ralentit et cherche ses mots dès qu'on lui demande <em>pourquoi</em> un ordre a été donné.</p>\n<p><strong>Rôle :</strong> commandante opérationnelle du <strong>Soleil Pourpre</strong>. Spécialiste des manœuvres urbaines, de la protection de convois et des fouilles discrètes. Casernes : <strong>La Garde-Fente</strong> (Porte Pourpre).</p>\n<p><strong>Secret (MJ) :</strong> loyale à ce qu'elle croit être un pouvoir légitime, elle est inconsciente de la manipulation occulte du <strong>Roi-Tyrannœil</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	WOMAN	\N	\N	\N	f	16	95	f	6
70268214-1ad4-4d19-a123-cb1cf268ac1c	Salome Lirn	<p>Femme humaine, 81 ans, ridée. Petite et sèche, pliée en avant ; elle se déplace de comptoir en étagère en s'appuyant sur les meubles.</p>\n<p>Visage profondément ridé, longue natte argentée ramenée sur l'épaule. Lunettes rondes toujours sales, qu'elle ne nettoie jamais. Yeux bleus délavés derrière les verres troubles. Mains tachées de vert et de brun.</p>\n<p><strong>Voix :</strong> fluette et chevrotante, qui s'éteint en fin de phrase. Parle lentement, très lentement, avec de longues pauses pendant lesquelles elle regarde un bocal plutôt que son client. Répond souvent à côté de la question, puis, trois minutes plus tard, exactement à la question. « <em>Chaque feuille connaît une époque, chaque graine se souvient d'un visage.</em> »</p>\n<p><strong>Rôle :</strong> tient <strong>L'Herbe &amp; le Sablier</strong>. Son chat à deux queues, <strong>Khem</strong>, dort sur le comptoir.</p>\n<p><strong>Secret (MJ) :</strong> elle garde sous le plancher une racine vivante de l'<strong>Arbre de Tal Odius</strong>.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	8507526b-0c7e-4d3a-bd95-8f4d47c1f8d7	HUMAIN	WOMAN	\N	\N	\N	f	11	22	f	1
41fa949e-a4a0-41b8-8c47-a3a6c080879f	Selianne Palhindile	<p>Femme demi-elfe, 29 ans, héritière <strong>Palhindile</strong>. Silhouette élancée, grâce naturelle dans chaque geste. Mains aux doigts fins, légèrement tachées d'encre malgré les gants de soie fine qu'elle porte en audience.</p>\n<p>Cheveux auburn aux reflets cuivrés, légèrement ondulés, portés mi-longs avec une broche d'or discrète sur le côté. Yeux noisette dorés aux reflets elfiques, regard à la fois chaleureux et perçant — elle évalue son interlocuteur aussi vite qu'elle lui sourit.</p>\n<p><strong>Voix :</strong> chaude et claire, d'une souplesse remarquable : elle s'aligne instinctivement sur le registre de son interlocuteur, plus rapide avec les marchands, plus feutrée avec les prêtres. Débit fluide, jamais pris en défaut, avec l'habitude de reformuler la position adverse mieux que son auteur avant d'y répondre — sa signature de médiatrice. Rit d'un rire bref et franc, jamais de complaisance.</p>\n<p><strong>Rôle :</strong> dirige la <strong>Cour des Ambassades</strong> et l'<strong>Académie des Médiateurs</strong>. Charismatique, diplomate idéale.</p>\n<p><strong>Secret (MJ) :</strong> elle a intercepté une lettre compromettante liant une Maison rivale à un complot contre sa mère la Chancelière — elle ne sait pas encore comment s'en servir.</p>\n<p><strong>Capacités notables :</strong> CA 14 · PV 36 · Dague +4. Persuasion +7, Intuition +6, Tromperie +4. Voix incorruptible 1/jour (dissipe Charme ou Suggestion).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	DEMI_ELFE	WOMAN	\N	{}	\N	f	14	36	f	4
35c5cd56-05ab-4d10-9489-bf09f3c1d9cc	Tarn Vess	<p>Homme humain, la cinquantaine, maigre. Doigts longs et secs, presque toujours tachés d'encre noire. Tenue grise, chemise boutonnée jusqu'au col, fonctionnelle à l'extrême.</p>\n<p>Front haut et largement dégarni. Lunettes à monture de cuivre perchées sur un nez aquilin ; yeux marron calmes et méthodiques derrière les verres.</p>\n<p><strong>Voix :</strong> unie et sans relief, celle d'un homme qui énonce des inventaires depuis trente ans. Débit lent et parfaitement régulier, sans jamais une inflexion — il annonce un manquant du même ton qu'un arrivage. Ne répond à une question qu'après avoir fini d'écrire la ligne en cours.</p>\n<p><strong>Rôle :</strong> contremaître des entrepôts <strong>Tovalis</strong>. Pragmatique, il tient les comptes officieux.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	11	26	f	1
4bd40fea-9407-4dee-a06c-0803f4d44362	Torv Arkhammar	<p>Homme nain, 121 ans. Massif et sanglé dans un harnais de carrier, épaules énormes ; il descend encore lui-même dans la fosse chaque matin.</p>\n<p>Visage large couvert d'une poussière cramoisie incrustée dans chaque ride. Barbe rousse virant au gris, tressée en une natte unique glissée sous le harnais. Yeux bleus vifs, très clairs dans ce visage rouge. Un masque de toile pendu au cou.</p>\n<p><strong>Voix :</strong> tonnante et enrouée, qui porte d'un bord à l'autre de la fosse ; il tousse sec entre les phrases — la poussière cramoisie, qu'il connaît mieux que personne. Débit direct et imagé, plein de comparaisons de carrière. Compte à rebours à voix haute avant chaque tir, et personne ne parle pendant.</p>\n<p><strong>Rôle :</strong> maître-carrier de la <strong>Carrière Écarlate</strong> — carrière à ciel ouvert, veines compactes. Gère les risques de glissements et la « <strong>poussière cramoisie</strong> » (inhalation : sauvegarde de Constitution DD 12 ou désavantage en Perception pendant 1 h).</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	NAIN	MAN	\N	\N	\N	f	14	52	f	4
abea18f1-9c07-449b-ab79-775016062e80	Veda Karom	<p>Humain, la trentaine. Taille moyenne, mince, vêtu de couleurs ternes choisies pour ne pas se remarquer ; s'assoit toujours dos au mur et face à la porte.</p>\n<p>Visage ordinaire, volontairement quelconque, barbe de trois jours. Cheveux châtains ni courts ni longs. Yeux gris attentifs, qui font le tour de la salle avant de se poser. Une brûlure ronde à l'intérieur du poignet gauche — la marque de <strong>La Braise</strong>, dissimulée sous la manche.</p>\n<p><strong>Voix :</strong> basse et tranquille, réglée juste sous le brouhaha d'une salle commune pour qu'on ne l'entende pas d'une table à l'autre. Débit calme et bref, sans jamais un nom propre inutile ; les personnes et les lieux sont désignés par des périphrases. Change de sujet sans transition dès qu'un serveur approche.</p>\n<p><strong>Rôle :</strong> contact de <strong>La Braise</strong>. Donne rendez-vous à <strong>La Roue de Secours</strong> ; met <strong>Harl Denvar</strong> en relation avec les PJ (Partie 5).</p>\n<p><em>Note MJ : son genre n'est pas établi en fiche — la description reste neutre.</em></p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	\N	\N	\N	\N	f	\N	\N	f	\N
9ef5f994-4e2a-4f0f-b443-cac13adf50db	Vittore Mastiggia	<p>Homme humain, la trentaine, mince et tiré à quatre épingles. Gants toujours immaculés, bague-sceau du clan <strong>Izotzargi</strong> à une chaîne.</p>\n<p>Cheveux noirs gominés, fine moustache ; sourire de marchand qui n'atteint jamais les yeux gris.</p>\n<p><strong>Voix :</strong> huilée et agréable, avec un accent dolomicien léger qu'il accentue ou gomme selon l'interlocuteur. Débit fluide et enjôleur, saturé d'euphémismes commerciaux ; il négocie même quand il n'y a rien à négocier. Dès qu'il est acculé, le timbre monte d'un cran et le débit double — c'est le seul moment où on l'entend vraiment.</p>\n<p><strong>Rôle :</strong> cadet ambitieux de la famille <strong>Mastiggia</strong> et cerveau de la combine : détourner discrètement des esclaves déjà « traités » par l'<strong>Œil Pourpre</strong> (la filière du Roi) pour les revendre à prix d'or à la cité vampire souterraine de <strong>Nharivum</strong>, sous Mongar. Se croit intouchable ; négocie toujours, ne se bat qu'acculé (rapière +4, 1d8+2). C'est lui, le représentant Mastiggia présent au point de transfert du <strong>Fretin</strong>. <strong>Bal Tovalis (Soir 1)</strong> : présent comme émissaire de la maison Mastiggia, sous les dehors d'un marchand dolomicien venu « nouer des contrats ».</p>\n<p><strong>Secret (MJ) :</strong> il vole la marchandise du Tyrannœil — s'il est exposé, le Roi l'écrasera avant les tribunaux.</p>	\N	10	14	12	16	12	16	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	CRIMINALITE	\N	\N	f	13	27	f	1
8771737e-2271-4026-b8a1-39795b4195b6	Yovan Kelep	<p>Homme humain, 55 ans. Grand et osseux, très droit, les mains jointes sur le ventre ; il se tient debout pendant les entretiens et ne s'assoit que pour écrire.</p>\n<p>Visage long et sévère, joues creuses, tonsure nette au sommet du crâne. Cheveux poivre et sel coupés ras sur les côtés. Yeux gris froids sous des sourcils rares. Une balance miniature en argent pendue au cou, insigne de <strong>Ral Zitris</strong>.</p>\n<p><strong>Voix :</strong> claire et sentencieuse, portée par une diction d'officiant ; chaque phrase sonne comme une lecture de texte. Débit lent et solennel, avec une pause avant chaque somme, qu'il énonce jusqu'au dernier cuivre — l'exactitude est chez lui un acte de dévotion. Termine tout entretien par « la balance retient », qui vaut signature.</p>\n<p><strong>Rôle :</strong> prêtre-auditeur des <strong>Larmes de Ral Zitris</strong>, banque vouée au dieu-compteur (aspect « contrition par l'exactitude »). Spécialiste des obligations de rançon et des dépôts judiciaires.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	HUMAIN	MAN	\N	\N	\N	f	12	30	f	3
0635e083-b406-40d7-993a-a29761a51e98	Aimon Ivelis	<p>Homme, 61 ans, chef de la famille <strong>Ivelis</strong>. Grand et large, le ventre pris dans une ceinture d'apparat ; il s'appuie des deux mains sur les accoudoirs pour se lever, et ne s'en cache pas.</p>\n<p>Visage massif et rougeaud, mâchoire lourde. Cheveux gris-blanc épais rejetés en arrière, barbe courte taillée au carré. Yeux noisette perçants sous des paupières lourdes — le regard des Ivelis, que ses cinq enfants ont tous hérité.</p>\n<p><strong>Voix :</strong> tonnante et chaleureuse en public, faite pour les banquets et les proclamations ; elle emplit une salle du trône sans effort. Débit ample, généreux en formules et en rires, avec l'art de faire passer une décision pour une faveur. En comité restreint, elle tombe d'une octave et devient sèche, coupante — et c'est la vraie.</p>\n<p><strong>Rôle :</strong> chef de la famille <strong>Ivelis</strong>, famille dirigeante de <strong>Huriya</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
daf4f14e-23a8-43a4-a8d5-6b8b15f4f5e3	Akkar Ivelis	<p>Homme, 34 ans, fils de la famille <strong>Ivelis</strong>. Solide et bien découplé, entretenu par la chasse et l'escrime de cour ; il se tient jambes légèrement écartées, comme s'il attendait un assaut.</p>\n<p>Visage large hérité de son père, mâchoire nette, teint hâlé. Cheveux châtain foncé coupés court. Yeux noisette perçants — le regard des Ivelis. Nez cassé une fois, remis correctement.</p>\n<p><strong>Voix :</strong> forte et sûre d'elle, habituée à être écoutée sans avoir eu à le mériter. Débit rapide et impatient, il interrompt volontiers et termine les phrases des autres. Quand son père est présent, le volume baisse de moitié et le débit se fait prudent.</p>\n<p><strong>Rôle :</strong> fils de la famille <strong>Ivelis</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
ef114e09-ba22-4700-9948-3472f61558f0	Aldren Voss	<p>Homme humain, 65 ans, Grand Prêtre du temple de <strong>Ral Ibris</strong> à Huriya. De stature imposante malgré l'âge — épaules larges, port de tête droit, démarche lente et assurée. Il porte les robes cérémonielles du culte — blanc cassé, broderies argentées de balances et de nœuds de contrat — et tient en permanence une balance miniature en argent, symbole de sa fonction.</p>\n<p>Visage carré, traits fermes, rides profondes autour des yeux et aux commissures des lèvres — les rides d'un homme qui a passé sa vie à écouter et à peser. Cheveux blancs coupés très court, barbe en collier bien taillée. Ses yeux sont remarquables : d'un bleu gris délavé, d'une placidité absolue. Ils ne jugent pas — ils enregistrent. Il maintient le contact visuel légèrement plus longtemps que la normale, ce qui met certains visiteurs mal à l'aise.</p>\n<p><strong>Voix :</strong> basse et bien timbrée, conçue pour les grands espaces — elle porte jusqu'au fond du Grand Temple sans qu'il ait à forcer. Débit lent et pondéré, avec une pause avant chaque conclusion, comme s'il laissait le plateau de la balance s'immobiliser. Ne hausse jamais le ton et ne reprend jamais un mot : ce qu'il a dit est dit.</p>\n<p><strong>Rôle :</strong> Grand Prêtre du <strong>culte de Ral Ibris</strong>. Incorruptible — non par vertu extrême, mais parce qu'il considère la corruption comme une forme de rupture de contrat avec l'univers lui-même.</p>	\N	13	11	15	16	20	17	\N	57171985-dade-4fcc-a00b-c06de058c7d6	de47dbe3-1415-4c22-9559-cb0b280e584c	HUMAIN	MAN	RELIGEUX	{COMMUN}	\N	f	14	65	f	5
dfc47ef6-1540-4d8a-b08e-73085ee56b36	Barros Mullimax	<p>Homme halfelin, la quarantaine, propriétaire de <strong>La Grenouille Royale</strong>. Petit et rond, avec l'énergie débordante d'un gamin de dix ans malgré ses tempes qui commencent à grisonner. Mains petites mais habiles, souvent colorées par les herbes et les extraits qu'il manipule — ce jour-là peut-être jaune safran, demain violet betterave. Tablier blanc moucheté de taches multicolores sur une chemise rayée, bretelles et pantoufles de velours vert.</p>\n<p>Visage rond et expressif — joues rebondies, nez en trompette, yeux noisette pétillants toujours à moitié plissés par le sourire. Favoris bruns soigneusement taillés en virgule de chaque côté du visage. Cheveux bouclés brun-roux toujours légèrement en désordre, comme s'il avait oublié de se coiffer après sa dernière expérience alchimique.</p>\n<p><strong>Voix :</strong> nasillarde et chaleureuse, montée d'un cran au-dessus du confortable, et qui ne s'arrête jamais très longtemps. Débit en cascade, ponctué de digressions enthousiastes et de « oh mais alors, dans ce cas… » ; il est incapable de laisser un client repartir sans lui avoir recommandé au moins trois autres produits. Chantonne entre deux clients sans s'en rendre compte.</p>\n<p><strong>Rôle :</strong> propriétaire de <strong>La Grenouille Royale</strong>.</p>	\N	8	15	12	17	15	16	\N	57171985-dade-4fcc-a00b-c06de058c7d6	8fc56667-67a4-426f-ad49-8edf2c48c9bf	HALFELIN	MAN	MARCHAND	{COMMUN,HALFELIN}	\N	f	12	22	f	1
8850bce9-a838-461e-b5f7-596394def846	Dame Elara Brumetaille	<p>Femme humaine, 57 ans. Grande et mince, maintien de cour irréprochable ; elle reste debout plus longtemps que ses interlocuteurs et les laisse s'asseoir en premier.</p>\n<p>Visage fin et pâle, pommettes hautes, peu de rides pour son âge. Cheveux gris argenté relevés en torsade stricte. Yeux bleu clair, attentifs, d'une amabilité constante. Aucun bijou visible sauf une broche aux armes des Écus.</p>\n<p><strong>Voix :</strong> douce, cultivée, d'une clarté parfaite — elle articule chaque mot comme si l'interlocuteur risquait d'en manquer un, ce qui est précisément l'effet recherché. Débit lent et enveloppant, avec des reprises légères qui reformulent vos propres arguments dans ses termes à elle. À la fin d'un entretien, on est souvent convaincu d'avoir eu l'idée soi-même.</p>\n<p><strong>Rôle :</strong> Protectrice des Écus — Conseillère Émérite de la <strong>Garnison des écus d'or</strong>. Loyale neutre. Manipulatrice subtile dotée d'une lecture sociale hors pair et de sorts d'influence (<em>Suggestion</em>, <em>Modification de mémoire</em>).</p>\n<p><strong>Capacités notables :</strong> PV 95 · CA 15.</p>	\N	9	14	14	18	17	20	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	HUMAIN	WOMAN	MILITAIRE	{}	\N	f	15	95	f	\N
d4dca1eb-398b-43b2-9733-6a4544296401	David IV	<p>Homme humain, 52 ans. Grand et massif, la carrure encore martiale sous les habits d'apparat ; il se déplace lentement et n'attend jamais personne.</p>\n<p>Visage large et dur, mâchoire lourde. Cheveux noirs grisonnants coupés court, barbe taillée au carré. Yeux bruns froids, immobiles. Une couronne fine, portée bas sur le front.</p>\n<p><strong>Voix :</strong> grave et tonnante, celle d'un homme qui n'a jamais eu à demander deux fois. Débit lent et catégorique, sans nuance ni conditionnel ; il tranche et passe à la suite. Ne prononce jamais le nom du <strong>Saint-Empire Momoritanien</strong> — il dit « l'autre rive ».</p>\n<p><strong>Rôle :</strong> dirige <strong>Gandorènne</strong> d'une main de fer. Royaume fondé il y a 100 ans par David III. Actuellement en guerre froide avec le Saint-Empire Momoritanien.</p>	\N	10	10	10	10	10	10	\N	7ccf7b24-0e5e-42e5-8493-76ee231c25ac	\N	HUMAIN	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
50f56fba-bd43-49b3-950c-826bb22de8da	Doran Kell	<p>Homme, 29 ans. Maigre et nerveux, les épaules en avant ; il porte toujours quelque chose, et trotte pour suivre le pas de son maître.</p>\n<p>Visage jeune et anguleux, semé de petites cicatrices d'étincelles. Cheveux noirs coupés court et inégaux, roussis d'un côté. Yeux marron attentifs, cernés. Avant-bras marqués de brûlures de fonderie à divers stades.</p>\n<p><strong>Voix :</strong> jeune et un peu haute, qui part dans l'aigu quand il est pressé — c'est-à-dire souvent. Débit rapide et déférent, il répète les consignes à voix haute pour être sûr de les avoir. Commence presque toutes ses phrases par « Maître Vharn dit que… ».</p>\n<p><strong>Rôle :</strong> assistant de <strong>Maddox Vharn</strong> à la fonderie <strong>La Frappe Brillante</strong> de Huriya.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
b4ed8705-c606-4d5c-b2b2-20a02d7f68dd	Galya Ivelis	<p>Femme, 27 ans, fille de la famille <strong>Ivelis</strong>. Grande et mince, port très droit appris en salle d'audience ; elle garde les mains croisées devant elle en public.</p>\n<p>Visage allongé, pommettes hautes, teint clair. Cheveux châtain clair tressés en couronne. Yeux noisette perçants — le regard des Ivelis, qu'elle a appris à adoucir volontairement.</p>\n<p><strong>Voix :</strong> claire et bien placée, d'une politesse qui ne se relâche jamais tout à fait. Débit mesuré, elle réfléchit visiblement avant de répondre et n'improvise pas. Sa seule fantaisie : un rire bref et franc, qui la surprend elle-même et qu'elle réprime aussitôt.</p>\n<p><strong>Rôle :</strong> fille de la famille <strong>Ivelis</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
88e30e84-b07b-4b8f-97fe-42f1ab21bd65	Keerla Ivelis	<p>Femme, 23 ans, fille de la famille <strong>Ivelis</strong>. Petite et vive, incapable de rester assise ; elle joue avec ses bagues, ses manches, tout ce qui passe.</p>\n<p>Visage rond, encore enfantin, semé de taches de rousseur. Cheveux roux foncé coupés court, indisciplinés. Yeux noisette perçants — le regard des Ivelis, qui détonne dans un visage aussi jeune.</p>\n<p><strong>Voix :</strong> haute et rapide, montée d'un cran quand elle s'enthousiasme, c'est-à-dire constamment. Débit en avalanche, elle enchaîne trois sujets sans respirer et rit au milieu de ses propres phrases. Baisse brutalement d'un ton et articule très lentement quand elle veut être prise au sérieux — ce qui marche, et l'étonne encore.</p>\n<p><strong>Rôle :</strong> fille de la famille <strong>Ivelis</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
ac73eee3-4844-4da5-acb9-9b01d92162a7	Lysa “Cendre-rose”	<p>Femme humaine, âge apparent 25 ans. Élancée, à la peau pâle constellée de petites cicatrices fines, vestiges d'une vie rude. Elle porte souvent des robes simples mais ouvertes, dans des tons rouges fanés, soigneusement entretenues malgré la misère ambiante.</p>\n<p>Cheveux roux sombres tombant en vagues désordonnées sur les épaules. Yeux gris, perçants, qui donnent l'impression qu'elle voit bien plus que ce qu'elle laisse paraître.</p>\n<p><strong>Voix :</strong> basse et un peu traînante, avec une ironie sèche qui affleure sur les fins de phrase. Débit lent et économe — elle <strong>parle peu mais écoute beaucoup</strong>, et laisse volontiers un silence s'installer pour voir ce que l'autre y versera. Répond souvent par une question qui n'en est pas une.</p>\n<p><strong>Personnalité :</strong> calme, ironique, rarement surprise. Elle a développé un talent certain pour retenir les secrets de ses clients… et pour les monnayer intelligemment.</p>\n<p><strong>Rôle :</strong> informatrice discrète pour les PJ, à <strong>La Salamandre Savoureuse</strong>. Peut connaître les allées et venues du <strong>Syndicat</strong>, cache parfois des objets pour certains clients, et peut demander protection en échange d'informations sensibles.</p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	WOMAN	CRIMINALITE	{COMMUN,ARGOT_VOLEUR,HALFELIN,GNOME,ELFIQUE,NAIN,ORC}	\N	f	\N	\N	f	\N
3ffea450-a1d7-4505-8008-5fd47e93abb5	Melrilvaethor Quifaren	<p>Femme demi-elfe, 62 ans (elle en paraît trente). Grande et athlétique, d'une souplesse de bretteuse ; elle se tient toujours de trois quarts, jamais de face.</p>\n<p>Visage anguleux, pommettes hautes, teint olivâtre. Cheveux noirs coupés à la nuque, une mèche blanche sur la tempe gauche. Yeux gris-vert extrêmement mobiles, qui recensent une salle en une seconde. Oreilles à peine pointues, l'une percée de trois anneaux.</p>\n<p><strong>Voix :</strong> chaude et engageante, un outil de recrutement avant tout — elle sait donner à un inconnu l'impression d'être déjà attendu. Débit fluide et flatteur, avec un rire facile, qui se referme d'un coup en phrases sèches et brèves dès que la conversation devient professionnelle. Retient et réutilise systématiquement les mots exacts de son interlocuteur.</p>\n<p><strong>Rôle :</strong> agent et recruteuse.</p>\n<p><strong>Capacités notables :</strong> PV 52 · CA 14. Œil du Conseil : avantage aux jets d'Intuition et de Perception. Dette de Sang : une cible marquée a désavantage contre elle. Rapière : +6, 1d8+4. Dague cachée : +6, 1d4+4. Action bonus : Désengagement.</p>	\N	10	16	14	10	10	15	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	DEMI_ELFE	WOMAN	CRIMINALITE	{COMMUN,NAIN,ELFIQUE,HALFELIN,ORC,ARGOT_VOLEUR}	\N	f	14	52	f	\N
0e7884ef-39e4-426c-ada4-4851a847be10	Perla Sonne	<p>Femme, 26 ans. Petite et menue, très droite, les mains toujours occupées par un dossier ou un plateau ; elle marche vite et sans bruit.</p>\n<p>Visage rond et avenant, teint clair. Cheveux blonds coupés au carré, retenus par une barrette simple. Yeux bleus attentifs, qui vérifient deux fois. Une tache d'encre récurrente sur le majeur droit.</p>\n<p><strong>Voix :</strong> claire et polie, d'une neutralité professionnelle bien tenue. Débit rapide et efficace, sans bavardage ; elle annonce, confirme, et se retire. Une particularité utile : elle répète mot pour mot les messages qu'on lui confie, y compris les intonations, ce qui en dit souvent plus que prévu.</p>\n<p><strong>Rôle :</strong> assistante dans l'<strong>Alliance des Veines</strong> à Huriya.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	WOMAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
7411def3-6e81-4808-96ef-b66596714505	Raskel “Langue-Cendre”	<p>Homme humain, 41 ans. Mince et souple, d'une élégance de joueur ; il s'assoit toujours dos à un mur et près d'une seconde sortie.</p>\n<p>Visage étroit et affable, teint pâle. Cheveux châtains ramenés en arrière, tempes dégarnies. Yeux verts très mobiles, un sourire toujours prêt. Doigts fins, tachés d'encre et de cendre — d'où le surnom.</p>\n<p><strong>Voix :</strong> son arme principale. Chaude, persuasive, d'une souplesse remarquable : il change d'accent et de registre à volonté, et vous rend un mensonge plus confortable que la vérité. Débit fluide et enveloppant, avec un rire complice placé exactement où il faut. Quand il est acculé, la chaleur disparaît d'un coup et la voix devient plate et rapide.</p>\n<p><strong>Rôle :</strong> chef de cellule du <strong>Syndicat</strong>, à <strong>La Salamandre Savoureuse</strong>.</p>\n<p><strong>Capacités notables :</strong> PV 82 · CA 15. Sauvegardes DEX +7, CHA +6. Tromperie +7, Persuasion +7, Discrétion +7, Perception +4. Maître des Faux : avantage aux tests de contrefaçon, faux documents et sceaux. Ordre du Syndicat (recharge 5–6) : 2 alliés visibles peuvent se déplacer OU attaquer en réaction. Fuite Préparée : sous 30 PV, il peut Désengager et se déplacer sans provoquer d'attaque d'opportunité (1/jour). Multiattaque (rapière + dague). Rapière : +7, 1d8+5 perforant. Dague cachée : +7, 1d4+5. Sable aveuglant (1/jour) : cône de 4,5 m, CON DD 14 ou Aveuglé jusqu'à la fin du prochain tour.</p>	\N	10	18	16	15	12	15	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	MAN	CRIMINALITE	{COMMUN,ARGOT_VOLEUR,ELFIQUE,HALFELIN}	\N	f	15	82	f	\N
103d4388-fc71-4dad-9b99-186119f693cd	Rhent « la Presse »	<p>Homme humain, d'une trentaine d'années, de taille moyenne, avec une silhouette mince qui contraste avec la force de ses mains. Il ne porte jamais rien de distinctif : vêtements de travail neutres, sans bijou, sans insigne.</p>\n<p>Visage ordinaire au point d'être mémorable pour ça — traits quelconques, teint neutre, cheveux brun terne coupés ras. C'est un homme que l'on oublie dans une foule. Ses yeux noisette sont néanmoins remarquables : ils analysent en permanence, calculent, mesurent. Ses doigts sont calleux et tachés d'une légère teinte grisâtre permanente — les résidus métalliques que même l'eau savonneuse n'efface jamais complètement.</p>\n<p><strong>Voix :</strong> plate et volontairement inintéressante, sans accent identifiable — il a effacé sa voix comme le reste. Débit bref et détaché, saturé de <strong>codes et d'euphémismes</strong>, au point que même ses collègues ne savent pas son vrai nom. Ne prononce jamais un chiffre en clair : il donne un poids, et l'on convertit.</p>\n<p><strong>Rôle :</strong> chef d'atelier de la <strong>fonderie clandestine du Conseil d'Acier</strong>. Son surnom vient de sa maîtrise des presses à coins, qu'il règle avec une précision d'horloger.</p>	\N	11	17	13	18	15	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	df3fc552-d2a7-4722-b627-367b28740fe5	HUMAIN	MAN	CRIMINALITE	{COMMUN}	\N	t	13	38	f	3
9b39a9d2-cbd1-4169-aec1-80c1e5acfa9d	Ser Aric Lancelame	<p>Homme humain, 44 ans. Sec et large d'épaules, d'une musculature fonctionnelle entretenue par l'entraînement quotidien ; il se déplace toujours en garde basse, sans y penser.</p>\n<p>Visage anguleux et hâlé, nez droit, mâchoire nette. Cheveux bruns coupés court, rasés sur les côtés. Yeux marron calmes et attentifs. Avant-bras marqués de fines cicatrices d'entraînement, jamais profondes.</p>\n<p><strong>Voix :</strong> claire et ferme, portée sans crier, celle d'un instructeur qui doit se faire entendre d'une cour entière. Débit net et pédagogique, il décompose tout en trois temps et répète le troisième. Ne crie jamais sur un élève : il baisse la voix, et c'est bien pire.</p>\n<p><strong>Rôle :</strong> Forgeron de la Justice — Maître d'Armes de la <strong>Garnison des écus d'or</strong>. Neutre bon.</p>\n<p><strong>Capacités notables :</strong> PV 120 · CA 17. Octroie +1 CA à ses alliés proches et peut parer jusqu'à 1d10+4 dégâts par réaction.</p>	\N	18	12	17	14	13	12	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	HUMAIN	MAN	MILITAIRE	{}	\N	f	17	120	f	\N
682aad82-314b-4061-9254-5793ba89e8be	Sir Aldric de Valbourg	<p>Homme humain, 58 ans. Très grand et massif, la silhouette épaissie par trente ans d'armure lourde ; il occupe le centre d'une pièce sans avoir à s'y placer.</p>\n<p>Visage large et buriné, nez cassé et remis. Cheveux gris fer coupés ras, barbe courte et drue. Yeux bleu acier, fixes. Une cicatrice épaisse part de la tempe droite et disparaît dans la barbe.</p>\n<p><strong>Voix :</strong> énorme et grave, une voix de commandement qui traverse un champ de manœuvre — c'est sa <strong>Présence Autoritaire</strong> faite son. Débit martelé, syllabe par syllabe sur les ordres importants, sans jamais répéter. Le silence qu'il laisse après une question vaut réprimande.</p>\n<p><strong>Rôle :</strong> Maître des Écus — Commandant Suprême de la <strong>Garnison des Écus d'Or</strong>. Loyal neutre. Vétéran de guerre, il commande la cohorte d'une main de fer.</p>\n<p><strong>Capacités notables :</strong> PV 168 · CA 19.</p>	\N	20	12	20	16	15	18	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	HUMAIN	MAN	MILITAIRE	{}	\N	f	19	168	f	\N
c986e6da-4b07-417f-a5f0-dbdf3e34d2e0	Vael Korshen	<p>Homme, 37 ans. Taille moyenne, sec et souple, d'une discrétion physique travaillée ; il s'appuie aux murs plutôt qu'il ne s'y adosse, prêt à partir.</p>\n<p>Visage maigre et fermé, mâchoire rasée de près. Cheveux noirs coupés court. Yeux gris froids, très peu expressifs. Une bague d'acier brut au pouce — la marque du <strong>Conseil</strong>, qu'il tourne machinalement.</p>\n<p><strong>Voix :</strong> basse et unie, calibrée pour ne pas dépasser la table ; il parle en regardant ailleurs. Débit bref et sans chaleur, uniquement l'utile ; il ne salue pas et ne prend pas congé. Frappe trois fois du doigt sur le bois avant de conclure — le tic du Conseil d'Acier.</p>\n<p><strong>Rôle :</strong> agent criminel du <strong>Conseil d'Acier</strong> opérant à Huriya, lié à la cellule locale.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
460b4174-26c0-4c0a-b713-05eda1781183	Asdis Elurra	<p>Femme drakéide, 26 ans, fille du roi <strong>Tonur Elurra</strong> et d'<strong>Erlea Gerlaria</strong>. Taille moyenne, compacte et solidement charpentée ; posture très droite, épaules basses.</p>\n<p>Écailles gris-bleu ardoise virant au blanc sur la gorge — la livrée des Elurra. Cornes courtes et épaisses, ornées d'anneaux de cuivre. Yeux verticaux d'un bleu glacier. Une écaille manquante à la tempe droite, jamais repoussée.</p>\n<p><strong>Voix :</strong> grave et posée pour son âge, avec une lenteur qui contraste avec celle de son frère. Débit mesuré, elle pèse chaque phrase et n'élève jamais le ton — ce qui la fait écouter dans une salle où tout le monde crie. Répète la dernière proposition de son interlocuteur avant de répondre, réflexe appris à la cour.</p>\n<p><strong>Rôle :</strong> fille du roi Tonur Elurra et d'Erlea Gerlaria.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	DRAKEIDE	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
80cd77ba-2ea6-4f4e-9e3f-3acb57577fa2	Vaszar Molthein	<p>Homme humain, d'une soixantaine d'années, grand et osseux, au dos légèrement voûté par des décennies passées à compter des colonnes de chiffres. Uniforme civil impérial — redingote gris ardoise aux boutons dorés, épaulettes sobres indiquant son rang — et un registre relié de cuir bordeaux en permanence à la main.</p>\n<p>Visage long, joues creusées, teint jaunâtre d'un homme qui ne sort jamais beaucoup. Barbe grise taillée au millimètre et lunettes en demi-lune en permanence vissées sur le nez. Yeux d'un brun terne, qui évaluent immédiatement tout interlocuteur en termes de valeur et de menace.</p>\n<p><strong>Voix :</strong> pointue et pincée, avec l'<strong>accent des hautes sphères momoritaniennes</strong> qu'il entretient soigneusement. Débit lent et d'une précision quasi chirurgicale dans le choix des mots ; il corrige les vôtres au passage. Ne sourit — et ne rit d'un petit rire bref — que lorsqu'il a obtenu ce qu'il voulait.</p>\n<p><strong>Rôle :</strong> intendant impérial en charge de la <strong>Fonderie Royale Momoritanienne</strong> de Huriya.</p>\n<p><strong>Secret (MJ) :</strong> imperméable à la corruption frontale, mais influençable par des arguments touchant à son avancement de carrière.</p>	\N	9	11	12	18	16	14	\N	57171985-dade-4fcc-a00b-c06de058c7d6	65b1535b-b040-4e90-bc3f-25734e675ae1	HUMAIN	MAN	POLITIC	{COMMUN}	\N	f	11	32	f	2
a769c06b-ef2d-4987-ad34-80758bd81651	Vessna Kholt	<p>Femme, 45 ans. Grande et large d'épaules, d'une présence physique dont elle joue ; elle reste debout pendant que ses interlocuteurs s'assoient.</p>\n<p>Visage dur et carré, teint mat, cheveux noirs coupés très court. Yeux noirs sans chaleur. Une cicatrice verticale à la lèvre inférieure. Mains couvertes de bagues lourdes, portées comme des poings américains.</p>\n<p><strong>Voix :</strong> grave et râpeuse, avec une lenteur d'intimidation parfaitement maîtrisée. Débit très lent, une phrase à la fois, chaque silence laissé ouvert pour que l'autre s'y enfonce. Ne menace jamais explicitement : elle décrit des conséquences au présent de l'indicatif, comme si elles avaient déjà eu lieu.</p>\n<p><strong>Rôle :</strong> cadre supérieure de l'<strong>Alliance des Veines</strong> à Huriya, organisation criminelle.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	WOMAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
616401be-fdef-45c9-bf7d-81a7039544f5	Vraxx Aurodent	<p>Homme drakéide, soixante ans, à l'ascendance dorée évidente. Stature impressionnante même pour un drakéide — plus d'un mètre quatre-vingt-dix, large d'épaules, une présence qui remplit une pièce. Vêtements de marchand de haute qualité, bordeaux et bronze, sans ostentation ; montre à gousset en or massif frappée à l'effigie familiale toujours en vue.</p>\n<p>Écailles d'or pâle tirant sur le bronze, cornes courtes recourbées vers l'arrière. Yeux verticaux d'un ambre profond, au regard d'une acuité redoutable ; visage marqué par les années — écailles plus ternes autour des yeux, quelques-unes ébréchées.</p>\n<p><strong>Voix :</strong> profonde et résonnante, avec le grondement de poitrine caractéristique des drakéides dorés ; elle porte sans qu'il élève le ton. Débit lent et d'une courtoisie absolue, chaque phrase soigneusement tournée — et d'une inflexibilité totale dès qu'il s'agit de prix ou d'honneur commercial. Cite de mémoire les chiffres d'une transaction vieille de dix ans sans consulter un registre.</p>\n<p><strong>Rôle :</strong> patriarche de la famille <strong>Aurodent</strong> et directeur général de <strong>La Monnaie du Dragon</strong>. Mémoire photographique des noms, des chiffres et des visages.</p>	\N	16	12	15	17	15	18	\N	57171985-dade-4fcc-a00b-c06de058c7d6	0c4d671e-5e18-48f2-b75f-d4e4402a9433	DRAKEIDE	MAN	MARCHAND	{COMMUN,DRACONIQUE}	\N	f	15	55	f	4
d45b4ef2-160c-4676-bdf4-cefd20ae05b3	Vyn Keller	<p>Homme humain, rond, environ 1,70 m, au visage nerveux et souvent crispé. Tunique brune, pantalon gris. Se déplace rapidement entre les tables.</p>\n<p>Cheveux blancs très longs et ondulés, rasés sur le côté gauche, lui donnant une allure singulière ; yeux bleus toujours en mouvement, qui surveillent la salle avec inquiétude ; peau bronzée et rugueuse, marquée par des années de travail ingrat.</p>\n<p><strong>Voix :</strong> hachée et trop rapide, qui monte dans l'aigu dès qu'on lui pose une question précise. Débit fuyant : il commence trois réponses et n'en finit aucune, coupe court par un « faut que j'y aille » et s'éclipse. Baisse instantanément d'un ton dès qu'<strong>Aegeard</strong> entre dans la salle.</p>\n<p><strong>Rôle :</strong> homme de main du <strong>Syndicat</strong>, subordonné d'<strong>Aegeard Blanks</strong> à <strong>La Salamandre Savoureuse</strong>. Il évite les regards trop insistants et obéit au moindre signe — il sait trop de choses et fait tout pour ne jamais trop en dire.</p>	\N	10	17	10	10	14	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	MAN	CRIMINALITE	{COMMUN,ARGOT_VOLEUR}	\N	f	15	38	f	\N
f3d80b81-48fa-4774-b5c3-748584cfecac	Afa NoirMarée	<p>Femme génasi de terre, 64 ans. Basse et massive, d'une densité inhabituelle ; les planchers craquent sous elle et elle ne s'en excuse plus.</p>\n<p>Peau brun-gris veinée de filons de quartz qui affleurent aux pommettes et au dos des mains. Cheveux tressés serré, couleur de racine. Yeux entièrement noirs, sans sclère. Une poussière minérale se dépose là où elle s'assoit longtemps.</p>\n<p><strong>Voix :</strong> très basse et caverneuse, avec une résonance de fond de puits qu'on sent dans le sternum autant qu'on l'entend. Débit extrêmement lent, de longues pauses entre les propositions ; ses étudiants ont appris à ne pas combler les silences. Ne répète jamais une consigne — mais la donne toujours deux fois d'affilée la première fois.</p>\n<p><strong>Rôle :</strong> professeure à la <strong>Nécrole</strong> de Brodnica.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	GENASITERRE	WOMAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
bdb9e983-b145-4aa7-a0e8-0606cc53c055	Aner Elurra	<p>Homme drakéide, 29 ans, fils du roi <strong>Tonur Elurra</strong> et d'<strong>Erlea Gerlaria</strong>. Grand et élancé pour un drakéide, plus coureur que lutteur ; il bouge vite et se tient rarement immobile.</p>\n<p>Écailles gris-bleu ardoise virant au blanc sur la gorge — la livrée des Elurra. Cornes fines et droites, ramenées en arrière, l'une limée à la pointe. Yeux verticaux d'un bleu glacier, hérités de sa mère.</p>\n<p><strong>Voix :</strong> claire et tendue, avec le sifflement léger que donnent les crocs sur les sifflantes. Débit rapide et impatient ; il termine les phrases des autres, surtout celles de sa sœur. Depuis la captivité de son frère, sa voix se casse chaque fois qu'il prononce le nom d'<strong>Ornolf</strong> — et il l'évite.</p>\n<p><strong>Rôle :</strong> fils du roi Tonur Elurra et d'Erlea Gerlaria.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	DRAKEIDE	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
f05d0a1c-b812-402b-b334-725a9e63a11d	Ayas Sarwens	<p>Homme, 67 ans. Grand et squelettique, les vêtements flottants ; il se déplace lentement, d'un pas silencieux, et surgit là où on ne l'attendait pas.</p>\n<p>Visage émacié à l'extrême, pommettes saillantes, peau parcheminée. Crâne entièrement chauve, veiné de bleu aux tempes. Yeux enfoncés d'un gris presque blanc, aux pupilles très rétrécies. Ongles longs et jaunis, ambre foncé.</p>\n<p><strong>Voix :</strong> ténue et sifflante, comme filtrée par une gorge sèche ; elle ne porte pas, et pourtant on l'entend depuis le fond de l'amphithéâtre. Débit lent et didactique, chaque terme technique articulé avec un plaisir visible. Marque un temps d'arrêt avant les mots « mort », « cadavre » et « âme », comme s'il les savourait.</p>\n<p><strong>Rôle :</strong> directeur de l'école de nécromancie clandestine — la <strong>Nécrole</strong> — sous Brodnica. Niveau 12.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
581d24ff-5df3-4e16-b585-b932895bb945	Erlea Gerlaria	<p>Femme drakéide, morte à 58 ans, épouse du roi <strong>Tonur Elurra</strong>. Elle était grande et sèche, d'un maintien rigide que trois enfants n'ont jamais assoupli.</p>\n<p>Écailles blanc-gris pâle nuancées de bleu aux jointures, livrée des <strong>Gerlaria</strong>. Cornes longues et effilées, portées nues. Yeux verticaux d'un bleu glacier — ceux qu'elle a transmis à ses trois enfants.</p>\n<p><strong>Voix :</strong> claire et coupante, sans chaleur, avec une articulation d'une netteté redoutable. Débit bref et définitif ; elle ne se répétait pas et ne s'expliquait pas. À la cour de Brodnica, on dit encore d'une décision sans appel qu'« elle est dite à la Gerlaria ».</p>\n<p><strong>Rôle :</strong> épouse du roi Tonur Elurra. <em>Décédée.</em> Fille d'<strong>Ornulf</strong> et d'<strong>Eydis Gerlaria</strong>.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	DRAKEIDE	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
9ea769c9-d2cf-42f1-a789-34b0d95a4784	Esebio Tomasio	<p>Homme, 51 ans. Grand et mince, très soigné, la mise d'un diplomate en poste à l'étranger qui tient à ne pas se fondre.</p>\n<p>Visage long, teint olivâtre, barbe noire taillée en pointe. Cheveux noirs gominés, grisonnants aux tempes. Yeux marron foncé, mi-clos, à l'expression perpétuellement amusée. Bagues discrètes, parfum reconnaissable.</p>\n<p><strong>Voix :</strong> veloutée et posée, avec un accent dolomicien qu'il entretient comme une carte de visite. Débit lent et onctueux, très riche en formules de politesse derrière lesquelles il ne dit rien ; il peut parler dix minutes sans s'engager. Passe à un débit sec et rapide dans les deux seules situations où il est sincère : l'argent et sa femme.</p>\n<p><strong>Rôle :</strong> représentant du gouvernement des <strong>Duchés des Dolomites</strong> à Brodnica. Réside au palais du comte.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
176be2e9-702b-405b-921d-9d09f352d714	ForteGriffe	<p>Homme drakéide, 35 ans. Colossal et couturé, la masse d'un barbare qui a survécu à tout ; il se place systématiquement entre <strong>Snakha</strong> et la porte.</p>\n<p>Écailles vert sombre, ternies et éclatées par endroits. Cornes épaisses, la gauche brisée à mi-longueur. Yeux verticaux jaunes. Les griffes des deux mains sont anormalement longues et entretenues — d'où son nom.</p>\n<p><strong>Voix :</strong> un grondement de gorge plus qu'une voix, très grave, qui vibre dans les tables. Débit minimal : il grogne l'assentiment, gronde le refus, et ne prononce que rarement des mots entiers. Quand il parle vraiment, l'auditoire se tait — c'est déjà arrivé trois fois.</p>\n<p><strong>Rôle :</strong> garde du corps barbare de <strong>Snakha</strong> à Brodnica.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	DRAKEIDE	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
2ebc90db-ef0d-422d-a399-6927949b58d2	Fulrad Longue-Rivière	<p>Homme, 55 ans. Grand et bedonnant, l'allure bonhomme d'un notable de province ; il pose volontiers la main sur l'épaule de ses interlocuteurs.</p>\n<p>Visage rond et coloré, favoris blancs fournis. Cheveux blancs clairsemés. Yeux bleus rieurs, qui ne rient pas toujours en même temps que la bouche. Gilet à chaîne de montre, doigts boudinés.</p>\n<p><strong>Voix :</strong> ronde et cordiale, montée sur un registre de bonne compagnie ; il rit fort et souvent, à commencer par ses propres plaisanteries. Débit généreux, plein de digressions champêtres qui font oublier la question qu'on lui avait posée — méthode, pas distraction. Le rire s'éteint d'un coup quand on parle de comptes.</p>\n<p><strong>Rôle :</strong> directeur de la cellule de la <strong>Chambre de Commerce Clandestine et Honnête</strong> (C.C.C.H) à Brodnica.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	MARCHAND	{}	\N	f	\N	\N	f	\N
ff32ede9-76b9-42e3-b190-1d6c9e5bb291	Immiq Ammi	<p>Homme tieffelin, 52 ans. Longiligne et anguleux, le dos droit ; il enseigne debout et immobile, les mains derrière le dos.</p>\n<p>Peau gris-violet, cornes en spirale serrée collées au crâne. Visage étroit, pommettes tranchantes. Yeux entièrement noirs sans pupille visible. Queue fine qu'il enroule autour de sa cheville pendant les cours — son seul tic.</p>\n<p><strong>Voix :</strong> douce et curieusement chaleureuse, qui déconcerte au vu du sujet enseigné ; il parle de dissection comme d'autres de jardinage. Débit calme et régulier, avec de petites plaisanteries sèches glissées sans changer de ton. Appelle tous ses étudiants « mon enfant », y compris les plus âgés.</p>\n<p><strong>Rôle :</strong> professeur à la <strong>Nécrole</strong> de Brodnica.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	TIEFFELIN	MAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
ee3489ea-5834-41a2-aa91-b024742847e5	Malriho Uzuth	<p>Homme drow, 214 ans. Mince et de taille moyenne, d'une élégance froide ; il ne fait jamais un geste inutile et supporte mal la lumière des amphithéâtres.</p>\n<p>Peau d'un gris-noir profond, cheveux blancs coupés à la nuque. Visage fin aux traits acérés, oreilles très effilées. Yeux rouge sombre, plissés en permanence. Une brûlure ancienne au dos de la main gauche, en forme de rune.</p>\n<p><strong>Voix :</strong> basse et soyeuse, d'une politesse glacée qui rend les remarques les plus dures impossibles à relever. Débit lent, parfaitement articulé, avec un léger accent des Profondeurs sur les r. Ne hausse jamais le ton ; il descend d'un demi-ton, et l'amphithéâtre se fige.</p>\n<p><strong>Rôle :</strong> professeur à la <strong>Nécrole</strong> de Brodnica.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	OTHER	MAN	RELIGEUX	{}	\N	f	\N	\N	f	\N
6bdb5a9f-0725-4bc1-bfc0-a236788049f7	Norgac Delsarane	<p>Homme, 49 ans. Taille moyenne, empâté par le bureau, épaules rondes ; il porte toujours trop de dossiers pour ses bras.</p>\n<p>Visage rond et fatigué, cernes marqués. Cheveux châtains clairsemés et mal peignés. Yeux noisette résignés derrière des besicles de travers. Encre sur le poignet de chemise, invariablement.</p>\n<p><strong>Voix :</strong> nasale et lasse, qui traîne sur les fins de phrase comme s'il s'excusait d'exister. Débit monocorde et procédural — il récite des articles de règlement avec l'entrain d'un homme qui les a tous essayés. S'anime d'un coup, et devient étonnamment précis et véhément, dès qu'on met en cause la ville elle-même.</p>\n<p><strong>Rôle :</strong> responsable administratif de la ville de <strong>Brodnica</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
08f2a4b8-c936-43e7-8123-408a146f0ab7	Ornolf Elurra	<p>Homme drakéide, 32 ans, fils du roi <strong>Tonur Elurra</strong>. Large et puissamment bâti, l'aîné de la fratrie — mais la captivité l'a creusé : les écailles flottent sur les épaules.</p>\n<p>Écailles gris-bleu ardoise virant au blanc sur la gorge, livrée des Elurra, ternies et sales. Cornes épaisses, sciées à ras — mutilation délibérée de ses geôliers. Yeux verticaux d'un bleu glacier, les seuls à n'avoir rien perdu.</p>\n<p><strong>Voix :</strong> éraillée et basse, abîmée par la soif et le silence ; elle s'éteint après quelques phrases et il doit attendre pour reprendre. Débit lent, entrecoupé, avec de longues pauses où il rassemble ses mots. Ne dit jamais « quand je sortirai » — il dit « si ».</p>\n<p><strong>Rôle :</strong> fils du roi Tonur Elurra, actuellement <strong>captif</strong>.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	DRAKEIDE	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
662ac8f6-d0cc-41d6-a6fd-90458c351786	Aedran Elvaltis	<p>Homme, 45 ans, gouverneur de Kalanos. Imposant — grand et large, une carrure que la charge n'a pas encore alourdie ; il occupe le haut bout de la table sans discuter.</p>\n<p>Cheveux noirs grisonnants, coupés court et coiffés en arrière. Visage carré, mâchoire forte, teint mat. Yeux noirs attentifs, froids. Une bague de fonction à l'index droit.</p>\n<p><strong>Voix :</strong> grave et posée, avec l'autorité tranquille d'un administrateur qui n'a pas besoin de rappeler son rang. Débit lent et pragmatique, sans fioriture diplomatique : il énonce ce qui est possible, puis ce qui ne l'est pas. Répète le mot « ordre » plus souvent qu'il ne le croit.</p>\n<p><strong>Rôle :</strong> gouverneur de <strong>Kalanos</strong>. Diplomate pragmatique contrôlant strictement les carrières, soucieux de l'ordre impérial.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
1ada61d8-de4f-4661-a71a-9f4a296091f2	Alym	<p>Homme humain, 58 ans. De taille moyenne, sec et droit, la mise soignée d'un souverain qui règne par l'administration plus que par l'épée.</p>\n<p>Visage anguleux au teint hâlé, barbe noire courte striée de blanc. Cheveux noirs sous le turban d'apparat. Yeux noirs, patients. Mains fines, ongles soignés.</p>\n<p><strong>Voix :</strong> posée et musicale, avec les intonations chantantes du Sandarane. Débit lent et imagé — il répond volontiers par une maxime ou une comparaison, et laisse à l'interlocuteur le soin de conclure. Ne dit jamais « non » directement : il dit « pas encore, si les dieux le veulent ».</p>\n<p><strong>Rôle :</strong> famille régnante du <strong>Sultanat de Sandarane</strong> depuis plus de 400 ans. Siège à Sandarane.</p>	\N	10	10	10	10	10	10	\N	b35688a0-96ed-4416-82b9-19db566f7815	\N	HUMAIN	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
8bea76f4-b502-41cc-91f4-69c86a4e4965	Arienna Zandris	<p>Femme, 41 ans, petite et énergique. Toujours en mouvement dans son échoppe, elle manipule ses pierres en parlant sans jamais en faire tomber une.</p>\n<p>Cheveux noirs relevés en chignon, quelques mèches échappées. Visage rond et mobile, teint mat. Yeux noirs très vifs, qu'elle plisse pour évaluer une taille. Loupe de joaillier suspendue au cou.</p>\n<p><strong>Voix :</strong> vive et haut perchée, avec un débit d'enchère — rapide, rythmé, qui ne laisse pas le temps de réfléchir au prix. Elle passe d'un sujet à l'autre en gardant la même intensité. Baisse d'un ton et ralentit pour parler d'une pierre qu'elle aime vraiment, et là, on écoute.</p>\n<p><strong>Rôle :</strong> figure influente du commerce local de <strong>Kalanos</strong>, spécialisée dans les ornements en pierre précieuse.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	WOMAN	MARCHAND	{}	\N	f	\N	\N	f	\N
06fd06bd-a4be-43f4-8bdd-da2b570df0e3	Aurore Grandpont	<p>Femme humaine, 31 ans. Taille moyenne, silhouette quelconque, vêtements de ville ternes ; elle a l'allure exacte de trois cents autres personnes à Russolio, ce qui fait sa valeur.</p>\n<p>Visage ordinaire et avenant, teint clair. Cheveux châtains attachés simplement. Yeux gris, attentifs. Aucun signe distinctif, aucun bijou.</p>\n<p><strong>Voix :</strong> moyenne en tout — ni grave ni aiguë, sans accent identifiable, d'un volume parfaitement banal. Débit naturel et bavard, celui d'une voisine ; elle pose des questions ordinaires et retient toutes les réponses. Ne répète jamais un nom entendu : elle l'écrit, plus tard, ailleurs.</p>\n<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Russolio.</p>	\N	10	10	10	10	10	10	\N	bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	\N	HUMAIN	WOMAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
281811fa-ac00-4c94-a400-90192493191b	Boddynock Folkor	<p>Homme gnome, 78 ans. Petit et rond, l'air inoffensif ; il s'assoit dans les tavernes d'Iserna et y reste des heures sans que personne le remarque.</p>\n<p>Visage poupin, joues rouges, nez bulbeux. Cheveux blancs en couronne, oreilles décollées. Yeux bleus rieurs, qui ne perdent rien d'une salle.</p>\n<p><strong>Voix :</strong> chantante et volubile, d'une jovialité qui désarme ; il raconte des anecdotes interminables que personne n'écoute jusqu'au bout — et c'est le but, car il écoute pendant ce temps. Débit rapide, plein de digressions. Ne pose jamais de question directe.</p>\n<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>	\N	10	10	10	10	10	10	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	GNOME	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
84d45a45-0b27-44e8-bbae-7746c82fd96e	Drogan Kharvek — Le Porte-Faille	<p>Homme humain, 44 ans. Gigantesque et noueux, bâti pour la hache à deux mains ; couvert de peaux et de plaques dépareillées prises sur des vaincus.</p>\n<p>Visage taillé à la serpe, tanné par les steppes. Crâne rasé sur les côtés, longue mèche noire tressée d'anneaux de fer. Barbe noire fourchue. Yeux noirs enfoncés, injectés. Le nez et les arcades plusieurs fois refaits par des coups.</p>\n<p><strong>Voix :</strong> énorme et râpeuse, une voix de chef de guerre qui traverse un camp entier ; il ne parle qu'en criant à moitié. Débit martelé, en formules brèves et répétées que ses guerriers reprennent en chœur. En rage, elle descend d'une octave et devient un grondement que les chevaux entendent avant les hommes.</p>\n<p><strong>Rôle :</strong> chef de guerre des <strong>Beor Khan</strong>.</p>\n<p><strong>Capacités notables :</strong> PV 145 · bonus de maîtrise +4. Brise-Faille : +9 (2d12+5 tranchant). Attaque brutale : si la cible est déjà blessée, +2d6 dégâts. Rage du Porte-Faille : résistance aux dégâts physiques non magiques. Présence Dominante : ennemis à 6 m, JS SAG DD 15 ou effrayés 1 tour. Chef de Guerre : alliés à 9 m, +2 dégâts en mêlée.</p>	\N	20	14	17	11	14	16	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	HUMAIN	MAN	MILITAIRE	{}	\N	f	17	145	f	\N
604c2fbb-7b71-4ec7-bcbc-42e12e1739fe	Ennio Tomasio	<p>Bébé, quelques mois. Emmailloté dans les langes brodés aux armes des <strong>Tomasio</strong>.</p>\n<p>Joues rondes, duvet brun sur le crâne, yeux encore d'un bleu indécis.</p>\n<p><strong>Voix :</strong> celle d'un nourrisson — babils, gargouillis et hurlements. Les nourrices du palais du comte notent qu'il pleure rarement la nuit, mais sans relâche dès qu'on le sort du palais.</p>\n<p><strong>Rôle :</strong> enfant de la <strong>Famille Tomasio</strong> (comtes des Dolomites).</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	\N	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t	\N
196079e5-0523-4941-8347-e6c8dbbe5272	Frouse Fiddlefen	<p>Homme gnome, 71 ans. Petit et trapu pour un gnome, les épaules rondes ; il porte toujours un instrument sous le bras et propose de jouer avant qu'on le lui demande.</p>\n<p>Visage rond et jovial, nez rouge. Cheveux bruns bouclés semés de gris, favoris fournis. Yeux marron pétillants. Doigts courts et agiles.</p>\n<p><strong>Voix :</strong> chaleureuse et chantante, avec une tendance à glisser dans le fredonnement en milieu de phrase. Débit enjoué et digressif ; il transforme chaque réponse en anecdote et chaque anecdote en chanson. Sous le bavardage, il n'a jamais répondu à une seule question précise.</p>\n<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>	\N	10	10	10	10	10	10	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	GNOME	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
34b86280-ebf7-4398-a216-1cd8daafd39e	Tenabis Kinemor	<p>Homme, 35 ans, membre de la famille royale <strong>Kinemor</strong>. Grand et mince, le maintien d'un homme d'armes plus que d'un courtisan ; il porte l'épée de cour comme s'il s'en servait.</p>\n<p>Visage anguleux, teint clair, cicatrice fine au menton. Cheveux blond cendré coupés court. Yeux bleu pâle, directs.</p>\n<p><strong>Voix :</strong> nette et ferme, avec l'accent pointu momoritanien tempéré par des années de garnison. Débit bref et concret, il déteste les circonlocutions de cour et le montre. Coupe court aux compliments d'un « au fait » qui a fait sa réputation et lui a coûté deux alliances.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
dd2598e4-5d11-4837-9fd6-1b98611f49e8	Tonur Elurra	<p>Homme drakéide, 58 ans, <strong>17<sup>e</sup> du nom</strong>. Haut et puissant, la stature d'un roi drakonien ; il se tient très droit, et le trône de Brodnica a été taillé pour cette posture.</p>\n<p>Écailles gris-bleu ardoise virant au blanc sur la gorge — la livrée des Elurra. Cornes longues et épaisses, cerclées d'or à la base. Yeux verticaux d'un bleu glacier. Une écaille manquante au front, remplacée par une plaque d'or sertie.</p>\n<p><strong>Voix :</strong> profonde et grondante, avec la résonance de poitrine des grands drakéides ; elle emplit la salle du trône sans qu'il élève le ton. Débit lent et solennel, chaque phrase construite comme une sentence. Depuis la capture d'<strong>Ornolf</strong>, il s'interrompt parfois au milieu d'une audience, reste silencieux plusieurs secondes, puis reprend exactement où il en était.</p>\n<p><strong>Rôle :</strong> roi drakonien de <strong>Brodnica</strong>. Le trône se transmet de père en fils, chacun prenant le nom de Tonur. Fils de <strong>Teit Elurra</strong> et <strong>Drifa Mendia</strong> ; époux d'<strong>Erlea Gerlaria</strong> (décédée) ; père d'<strong>Ornolf</strong>, <strong>Aner</strong> et <strong>Asdis</strong>.</p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	DRAKEIDE	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
10e0a92f-64b2-4051-97b1-d8169ad8326f	Triosz	<p>Homme, 33 ans. Mince et long, d'une souplesse silencieuse ; il occupe les toits et les encoignures, et on ne le voit jamais entrer dans une pièce.</p>\n<p>Visage étroit et blême, pommettes saillantes, joues creuses. Cheveux blond très pâle coupés court. Yeux gris presque incolores, qui ne clignent pas assez. Doigts longs, une callosité nette à l'index droit.</p>\n<p><strong>Voix :</strong> basse et étonnamment neutre, sans accent et sans grain — celle de quelqu'un qui a pris l'habitude de ne pas être mémorisé. Débit minimal : il répond par un mot, souvent « oui ». Ne prononce jamais le nom d'une cible ; il désigne par un chiffre.</p>\n<p><strong>Rôle :</strong> sniper et assassin attitré pour éliminer les problèmes du <strong>Conseil d'Acier</strong> à Brodnica.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
c73f7e66-4bad-41b9-89ec-f16db2d8ee91	Trois Nuits	<p>Femme goliathe, élancée pour son peuple. Elle tient un bâton creux rempli de sable d'étoile qui s'écoule au rythme de ses visions.</p>\n<p>Stries argentées en spirale autour des tempes ; yeux violets constamment mi-clos.</p>\n<p><strong>Voix :</strong> ténue et légèrement décalée, comme si elle répondait à une question posée un instant plus tard — ce qui, chez une devineresse, n'est peut-être pas une figure de style. Débit lent, entrecoupé de pauses où le sable s'écoule seul. Emploie systématiquement le futur pour parler du présent.</p>\n<p><strong>Rôle :</strong> maîtresse devineresse du <strong>Monastère des Nuits</strong>. École : <strong>Divination</strong>. Lit les fils du possible.</p>\n<p><strong>Capacités notables :</strong> FP 4 · PV 44. Sorts signatures : Détection de la magie, Clairvoyance, Scrutation. « Éclat de futur » : impose un désavantage à une attaque qu'elle a entrevue (réaction, 3/jour). Vision passive des mensonges à 9 m.</p>	\N	14	10	16	17	18	14	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	GOLIATH	WOMAN	\N	\N	\N	f	12	44	f	4
5df0c961-2f3e-47be-86bd-105ca79c5f5f	Vampirien — escorte de Nharivum	<p>Spawn de vampire (escorte de chasse de l'émissaire de <strong>Nharivum</strong>), à la silhouette décharnée. <strong>Se déplace par saccades trop rapides</strong>, et reste parfaitement immobile entre deux.</p>\n<p>Visage émacié, crocs proéminents, ongles noircis en serres, peau grise tendue sur les os.</p>\n<p><strong>Voix :</strong> à peine une voix — un souffle rauque et sifflant entre les crocs, sans articulation véritable. Il ne parle pas : il siffle pour avertir, gronde pour menacer, et se tait sur ordre de <strong>Sélas Vharkorn</strong>. Ceux qui l'ont entendu émettre un son proche d'un mot n'ont pas survécu pour le confirmer.</p>\n<p><strong>Capacités notables :</strong> vampirien / spawn de vampire (FP 5). CA 15 · PV 82 · Vitesse 9 m, escalade d'araignée (surfaces et plafonds). Multiattaque : 2 attaques (griffes ou morsure). Griffes : +6, 2d4+3 tranchant ; au lieu des dégâts, agrippe (évasion DD 13). Morsure (cible agrippée, entravée ou consentante) : +6, 1d6+3 perforant + 3d6 nécrotique ; les PV max de la cible sont réduits d'autant, et le vampirien récupère ces PV. Régénération : 10 PV au début de son tour (sauf dégâts radiants ou eau courante au tour précédent). Résistances : nécrotique ; contondant, perforant et tranchant des armes non magiques. Faiblesses : lumière du soleil (dégâts + désavantage), dégâts radiants et eau courante bloquent la régénération ; un pieu dans le cœur d'un vampirien à terre le tue.</p>	\N	16	16	16	11	10	12	\N	ce3fb962-bb73-47f4-8e12-656c0af3f4a1	\N	\N	\N	\N	\N	\N	f	15	82	f	5
306e438b-31a2-4faa-9e4a-30408185897e	Vanda Tomasio	<p>Femme, 21 ans, jumelle de <strong>Vanessa Tomasio</strong>, fille d'<strong>Esebio</strong> et <strong>Belina</strong>. Mince et élancée, exactement la même silhouette que sa sœur ; elle se tient toujours à sa gauche.</p>\n<p>Visage long et fin, teint olivâtre, cheveux noirs bouclés portés relevés. Yeux marron foncé. Le seul signe qui la distingue de sa jumelle : un grain de beauté sous l'œil droit — et elle le couvre volontiers.</p>\n<p><strong>Voix :</strong> douce et posée, plus grave que celle de sa sœur d'un demi-ton, différence que seul leur père entend à coup sûr. Débit lent et réfléchi ; elle laisse Vanessa lancer les conversations et intervient pour conclure. Les deux sœurs terminent régulièrement les phrases l'une de l'autre, et en jouent devant les étrangers.</p>\n<p><strong>Rôle :</strong> fille d'Esebio et Belina Tomasio, à Brodnica. Gardée par <strong>Taral de l'Est</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
1e5f2c01-aa70-44bf-b9b9-6feed04701ac	Vanessa Tomasio	<p>Femme, 21 ans, jumelle de <strong>Vanda Tomasio</strong>, fille d'<strong>Esebio</strong> et <strong>Belina</strong>. Mince et élancée, exactement la même silhouette que sa sœur ; elle se tient toujours à sa droite.</p>\n<p>Visage long et fin, teint olivâtre, cheveux noirs bouclés portés relevés. Yeux marron foncé. Aucun grain de beauté sous l'œil droit — c'est ainsi qu'on les distingue, quand elles le permettent.</p>\n<p><strong>Voix :</strong> claire et vive, un demi-ton au-dessus de celle de sa jumelle. Débit rapide et enjoué, c'est elle qui aborde et qui charme ; elle pose les questions que sa sœur écoute. Les deux terminent régulièrement les phrases l'une de l'autre, et en jouent devant les étrangers.</p>\n<p><strong>Rôle :</strong> fille d'Esebio et Belina Tomasio, à Brodnica. Gardée par <strong>Taral de l'Est</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	WOMAN	POLITIC	{}	\N	f	\N	\N	f	\N
5aadd87e-afca-4a89-917a-c4eb9ebffcbb	Vieille Yenna	<p>Femme naine ancienne (~150 ans), le dos voûté par des décennies de travail du cuir. Ne quitte jamais sa tente sans son établi portatif.</p>\n<p>Mains couvertes de cicatrices fines et de cals. Cheveux blancs tressés d'aiguilles à coudre en os. Visage profondément ridé, yeux plissés à force de travailler au fil.</p>\n<p><strong>Voix :</strong> éraillée et basse, avec le chuintement d'une bouche à laquelle il manque des dents. Débit lent et bougon, entrecoupé de commentaires sur la qualité de ce qu'on lui apporte — « c'est pas du travail, ça » revient souvent. Elle ne dit jamais qu'un objet est irréparable : elle annonce un prix si élevé que le client renonce lui-même.</p>\n<p><strong>Inventaire</strong> (prix en po) : cape de fourrure d'hiver (résistance au froid) 20 po ; armure de cuir clouté, qualité tribale, 45 po ; sac à dos en peau tannée (capacité augmentée) 12 po ; réparation d'un objet en cuir, peau ou plume, 5 à 15 po selon l'ampleur — <em>elle peut réparer et entretenir la cape de plumes de pégase si le groupe la ramène endommagée</em> ; bottes fourrées (avantage aux JS contre le froid extrême) 18 po ; tente individuelle en peau imperméabilisée 30 po.</p>	\N	9	14	12	12	13	10	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	NAIN	WOMAN	MARCHAND	\N	\N	f	\N	\N	f	\N
22ae3151-a13b-40df-8bea-dfea432f9d5c	Ymal Kinemor	<p>Homme, 26 ans, membre de la famille royale <strong>Kinemor</strong>. Grand et maigre, les épaules en avant ; il paraît toujours vouloir quitter la pièce.</p>\n<p>Visage pâle et étroit, traits juvéniles. Cheveux blond cendré fins, coiffés sans conviction. Yeux bleu pâle fuyants. Les ongles rongés jusqu'au sang, que les gants de cour dissimulent mal.</p>\n<p><strong>Voix :</strong> faible et hésitante, avec l'accent pointu momoritanien mal assuré — on l'entend se corriger en cours de mot. Débit haché, plein de reprises et de « pardon, je voulais dire » ; il s'excuse d'avoir la parole. Une seule exception : lorsqu'il récite, et là le débit devient parfait, fluide et sans accroc.</p>\n<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	MAN	POLITIC	{}	\N	f	\N	\N	f	\N
3615fd66-e445-4ed3-8c84-fa6a8220e844	Zulban GardeBarbe	<p>Homme, 59 ans. Court et massif, enveloppé de robes sombres trop lourdes ; il se tient une demi-longueur derrière <strong>Snakha</strong> et ne s'assoit jamais avant lui.</p>\n<p>Visage large, teint gris. <strong>Barbe</strong> noire striée de blanc, très fournie, tressée en une natte unique glissée dans la ceinture — d'où son nom. Crâne chauve. Yeux noirs enfoncés, attentifs, qui surveillent la pièce plutôt que l'interlocuteur.</p>\n<p><strong>Voix :</strong> grave et sourde, volontairement effacée ; il parle bas pour que l'on se concentre sur son maître. Débit lent et prudent, uniquement quand on l'interroge, et jamais plus que la réponse exacte. Les incantations, en revanche, il les prononce d'une voix claire et forte qui surprend à chaque fois.</p>\n<p><strong>Rôle :</strong> mage personnel de <strong>Snakha</strong>, chef du <strong>Syndicat</strong> à Brodnica.</p>\n<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>	\N	10	10	10	10	10	10	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	MAN	CRIMINALITE	{}	\N	f	\N	\N	f	\N
a50188f9-724b-4ba6-b62b-0a1a0f43bf97	Brakk « l'Enclume »	<p>Homme demi-orc, 38 ans, Maître de l'Arène. Bâti comme le billot dont il porte le nom : court sur pattes, épais, le cou disparu dans les épaules. Se déplace peu et lentement, sauf sur le sable.</p>\n<p>Peau vert-gris épaisse et grêlée, crâne rasé. Défenses inférieures larges, l'une cassée en biseau. Arcades saillantes, sourcils quasi absents à force de coupures. Oreilles en chou-fleur, nez inexistant.</p>\n<p><strong>Voix :</strong> caverneuse et pâteuse — les mâchoires ont trop encaissé pour articuler proprement, et il mange la moitié des consonnes. Débit très lent, trois ou quatre mots à la fois, avec de longues respirations entre. Rit d'un seul son, bas et bref, quand quelque chose lui plaît vraiment. Quand il annonce un combat, il ne dit que deux noms et un chiffre.</p>\n<p><strong>Rôle :</strong> Maître de l'Arène et combattant de l'arène clandestine du <strong>Monocle du Diable</strong>, à Huriya — l'établissement que tient <strong>Ernil Sultaasar</strong>.</p>\n<p><strong>Capacités notables :</strong> PV 95 · CA 15. Implacable : quand Brakk tombe à 0 PV, il reste à 1 PV (1/jour). Seigneur de l'Arène : avantage aux attaques dans l'arène. Multiattaque (2 attaques). Marteau d'arène : +7, 1d10+4 contondant. Projection brutale : test de FOR opposé, la cible est projetée et à terre.</p>	\N	18	12	18	8	10	11	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	DEMI_ORC	MAN	CRIMINALITE	{COMMUN,ORC,ARGOT_VOLEUR}	\N	f	15	95	f	\N
fe11f5e3-b52a-446f-b6bd-18cf660a6eb9	Amiro Léovine	<p>Homme elfe, 214 ans. Grand et décharné, épaules tombantes, mains très longues qu'il tient souvent croisées sous le menton ; il ne s'assied jamais complètement, toujours au bord.</p>\n<p>Traits fins et tirés, pommettes hautes, peau grise de quelqu'un qui ne sort plus depuis longtemps. Cheveux blancs coupés net à l'épaule. Yeux d'un bleu très pâle où court parfois un éclat cristallin, comme un reflet pris dans une facette.</p>\n<p><strong>Voix :</strong> sèche et précise, sans chaleur, avec le détachement d'un homme qui explique pour la troisième fois quelque chose d'évident. Débit posé, phrases longues et parfaitement construites, jamais une reprise ni un « euh ». Appelle ses interlocuteurs par leur nom complet, systématiquement — y compris <strong>Elerÿna</strong>.</p>\n<p><strong>Rôle :</strong> cristomancien, anciennement <strong>Virion Omalee</strong> (V.O.). Précepteur d'Elerÿna ; clones cristallins et expériences Valdris.</p>\n<p><strong>Où le trouver :</strong> dans son <strong>laboratoire abandonné</strong>, en montagne (salles I–VI), que l'on ne rejoint que par son <strong>atelier</strong> de La Cinquième Roue — dont <strong>Laguna Temper</strong> détient la clé.</p>	\N	10	10	10	10	10	10	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	db659a2c-6014-494e-864e-1e1b09b29e13	ELFE	MAN	\N	\N	\N	f	\N	\N	f	\N
\.


--
-- Data for Name: Place; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Place" (id, name, description, "kingdomId", "cityId", "iconUrl", "districtId", "isForDM", map, "showOnMap", "placeType") FROM stdin;
aa0614c7-e0d3-4e0e-be3f-36c291d510ab	Grande arène de Huriya	Arène officielle de la cité de Huriya, théâtre de combats et spectacles.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
af873b6b-d45d-492e-a62a-5c9ba30d6852	Brasserie la Plume	(taverne bruyante)\n\nLe bâtiment en forme de L est composé d'un rez-de-chaussée et de deux étages, la pièce principale a été récemment rénovée. Au rez-de-chaussée, se trouve une salle pouvant contenir au maximum 20 personnes. Au devant de l'auberge, quelques tables et chaises permettent de prendre un verre à l'extérieur. A l'étage se trouvent les chambres, avec un minimum de commodité, avec un verrou qui permet de fermer la porte. Au deuxiéme étage se trouve d'autres chambres plus spacieuses pouvant accueillir un couple, la porte se ferme avec un verrou solide.\nDans cet établissement viennent souvent des voyageurs cherchant une escorte, de plus la proximité d'un temple d'une divinité bonne, amène souvent de braves gens.\n\nServices disponibles :\nchambre : 8 pièces avec des commodités agréables\nécuyer : 1 - qui prendra soin des pièces d'armures et des armes	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-tavern.svg	7402f449-7ae2-461d-9981-e45c942f169f	f	\N	t	TAVERNE_AUBERGE
74e17574-3460-4e45-bd2a-4036efa72359	Le bois du deuil	Le bois du deuil (taverne calme (pleins d'écrivain))\nVous vous approchez d'une taverne calme et accueillante. À travers les murs de briques, vous entendez des coups de marteau. Sur le côté gauche du bâtiment se trouve une modeste écurie avec une petite collection de chevaux.\nLorsque vous ouvrez la porte de la taverne, vous êtes accueillis par un petit groupe de clients. L'intérieur semble tout aussi accueillant que l'extérieur. Une faible lumière de bougie éclaire la pièce et derrière le bar en bois poli se tient un nain des collines costaud de 4'9" au visage oblong, aux cheveux auburn extrêmement longs et raides, à la barbe moyenne, aux yeux bruns et à la peau blanche et douce. Il porte une belle chemise grise et un pantalon ample jaune.\nEntre vous et le barman se trouve une série de tables hautes en bois robuste, à droite un foyer avec une flamme rugissante à l'intérieur, et à gauche un escalier en pierre.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-tavern.svg	a118cdca-1dd1-448f-9729-b688fe5b87ef	f	\N	t	TAVERNE_AUBERGE
3d31ebcc-3bf3-40f7-b2e5-44f00c86da88	Temple de Tal Odius (Kalanos)	Type (lore) : temple.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
90973c2b-35d8-4c57-ac8d-0a8ea86170a5	Château de Verre	Forteresse d'Alagir célèbre pour son colossal vitrail. Siège du pouvoir royal, ses reflets colorés illuminent la ville la nuit.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	/Icon/place.png	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
12c4b86b-580f-49f4-881a-7ba593cf175f	Géodes Pourprées	Carrières de marbre pourpre d'Alagir, uniques au monde. Labyrinthe de galeries mi-naturelles, mi-taillées, résonant du martèlement des outils Tovalis.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	/Icon/place.png	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
b15522c5-a603-424e-aa13-55a7e5de4785	Le Temple Scellé	Temple oublié enfoui sous les fondations d'Alagir, dormant et scellé depuis des siècles. Le nom du dieu qu'on y honorait a été martelé sur chaque pierre : nul ne sait plus qui y était adoré, ni qui a pris la peine de l'effacer.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	/Icon/place.png	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
c529b485-e20b-41a9-9954-3058397c3c7d	Palais des Ententes	Monument fondateur de Huriya et raison principale de son existence en tant que cité libre. Le Palais des Ententes est un édifice monumental en calcaire blanc veiné de gris, surmonté d'un dôme central à nervures dorées visible depuis la plupart des quartiers de la ville. Ses ailes latérales abritent les délégations permanentes des royaumes signataires du Pacte de Huriya.\n\nChaque délégation dispose de bureaux, d'appartements diplomatiques et d'une salle de réception aux couleurs de son royaume. La grande salle centrale — la Rotonde des Serments — est un espace circulaire sous le dôme, avec en son centre une table ronde en marbre noir sur laquelle sont gravés les noms de tous les traités signés depuis la fondation. Aucune arme n'est autorisée dans ce bâtiment ; même les gardes du corps personnels doivent déposer leurs lames à l'entrée.\n\nLe Palais est géré par un Corps de Médiateurs, fonctionnaires neutres qui facilitent les négociations et assurent la logistique diplomatique. Sa neutralité est protégée par un accord millénaire : attaquer le Palais ou son personnel équivaut à une déclaration de guerre à l'ensemble des signataires.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
0a7bd954-949d-479c-9d26-522c76b65a49	Arène du Goulet Écarlate	Arène clandestine d'Alagir, lieu de tournois illicites et de combats souterrains. Alias courant : Arène des Éclats. Éclats de verre dans le sable absorbent les larmes de sang pour le Roi.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	/Icon/place.png	7df130bd-3682-4c93-9412-a31f75d84ca8	f	\N	f	AUTRE
503b345e-650c-49d4-84e2-5289c7e9f69b	La Halte Éthérée	Type (lore) : ruines.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
83be24e6-483c-4bad-bd86-63a9e9f34379	Le Bourbier des Errants	Type (lore) : bidonville-souterrain.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
6a3f2770-8383-4464-b840-90386200965c	La Salamandre Savoureuse	La Salamandre Savoureuse est une taverne miteuse, tapageuse et poisseuse, dont la réputation dépasse largement son quartier. Bien avant d’en pousser la porte, on entend déjà des éclats de voix, des rires rauques et le bruit sourd de coups de poing frappant chairs et tables.\nLe bâtiment est bas, construit en pierres grossières mal jointées, recouvertes d’une peinture écaillée aux teintes indéfinissables.\n À l’avant, un porche en gravier s’étend sous un auvent de tissu élimé, troué à plusieurs endroits. Quelques bancs branlants y servent autant de lieu d’attente que de ring improvisé pour régler des différends mineurs.\nSur le côté droit, une écurie mal entretenue accueille un nombre modéré de chevaux. Les stalles sont sales, l’odeur âcre de fumier se mêle à celle de l’alcool renversé. Certains chevaux portent des marques douteuses, signe qu’ils n’ont peut-être pas été acquis légalement.\n\nÀ l’intérieur\nLorsque vous ouvrez la porte, une chaleur lourde et humide vous enveloppe aussitôt. L’air est saturé de sueur, d’alcool bon marché et de parfums trop forts. La salle est bondée, remplie d’individus aux regards durs et aux mains calleuses.\nL’intérieur est à l’image de l’extérieur : sale, bruyant, vivant.\n Les murs sont couverts de taches, de graffiti grossiers et de marques de lames. Le sol colle légèrement sous les bottes.\nDerrière un bar en bois taché, rongé par l’alcool et les années, se tient Aegeard Blanks.\n\nEntre vous et le bar se trouvent plusieurs tables hautes en bois, épaisses, rayées, parfois fendues. Certaines portent encore des traces brunâtres qui ne sont pas toutes dues au vin.\nÀ droite, un foyer bas contient un lit de braises rougeoyantes, entretenu en permanence. Il ne sert pas tant à réchauffer la pièce qu’à y maintenir une chaleur étouffante… et à faire disparaître discrètement certaines preuves.\nÀ gauche, un vieil escalier grinçant monte vers les étages supérieurs. Chaque marche proteste bruyamment, comme si elle avertissait ceux d’en haut qu’un visiteur arrive.\n\nLes prostituées travaillent principalement à l’étage, dans les chambres I et J du plan.\nElles sont surveillées, mais pas constamment, ce qui laisse place à :\ndes échanges discrets avec les PJ\ndes intrigues humaines\ndes choix moraux intéressants\n\n\n\nUne double nature :\n\nOfficiellement, la Salamandre Savoureuse est une taverne populaire et misérable.\n En réalité, elle sert aussi de maison de passe bon marché, où les chambres à l’étage accueillent clients et affaires louches à toute heure.\nMais surtout, la taverne est un repaire du Syndicat.\nIci :\nse négocient des vols\nse revendent des marchandises contrefaites\nse planquent des objets volés\net se recrutent des petites mains jetables\nChaque cellule du Syndicat étant autonome, la Salamandre fonctionne comme un nœud local, discret mais essentiel.\n\nAmbiance générale\nLa Salamandre Savoureuse est un lieu où :\nla violence est banale\nla morale est absente\nla loi ne franchit pas la porte\net où l’or circule plus vite que les vérités\nUn endroit idéal pour :\ntrouver un contact criminel\nvendre un objet volé\ndisparaître quelques jours\nou déclencher une bagarre qui dégénère\n\nPLAN DE LA SALAMANDRE SAVOUREUSE\n(taverne + maison de passe + repaire du Syndicat)\n🔻 REZ-DE-CHAUSSÉE — SALLE COMMUNE\n┌──────────────────────────────┐\n│ [A] Porche / Entrée          │\n│                              │\n│ [B] Tables hautes (bastons)  │\n│                              │\n│ [C] Bar (Aegeard)            │\n│                              │\n│ [D] Foyer / Braises          │\n│                              │\n│ [E] Escalier grinçant ↑      │\n│                              │\n│ [F] Porte arrière → Écurie   │\n└──────────────────────────────┘\nPoints notables\nB – Tables : terrain difficile si combat (chaises, alcool renversé).\nD – Foyer : braises utilisables comme arme improvisée.\nF – Porte arrière : sortie rapide vers l’écurie → fuite fréquente du Syndicat.\n\n🐎 ÉCURIE (EXTÉRIEUR, CÔTÉ DROIT)\n┌───────────────┐\n│ Stalles x6    │\n│               │\n│ [G] Remise    │\n│ (objets volés)│\n└───────────────┘\nG – Remise verrouillée (DD 13)\n → faux sacs de grain\n → cache d’objets contrefaits\n → chevaux volés ou maquillés\n🪜 ÉTAGE 1 — CHAMBRES & PASSE\n┌──────────────────────────────┐\n│ [H] Palier / Garde           │\n│ [I] Chambre 1 (clients)      │\n│ [J] Chambre 2 (clients)      │\n│ [K] Chambre “privée”         │\n│ (réunions du Syndicat)       │\n│                              │\n│ [L] Escalier ↓ secret        │\n└──────────────────────────────┘\nDétails\nI & J : chambres sales, rideaux épais, alcôves.\nK – Chambre privée\nTable, cartes, faux sceaux\nRegistre codé du Syndicat\nL – Escalier secret → sous-sol\n🔒 SOUS-SOL — CAVE DU SYNDICAT\n┌──────────────────────────────┐\n│ [M] Salle de stockage        │\n│                              │\n│ [N] Atelier contrefaçon      │\n│                              │\n│ [O] Cellule / Silence        │\n│                              │\n│ [P] Tunnel effondré          │\n│ (ancienne sortie)            │\n└──────────────────────────────┘\nN – Atelier : matrices, moules, fausses monnaies, faux documents\nO – Cellule : prison courte durée / interrogatoires\nP – Tunnel : praticable pour une fuite lente\n\n\n	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-tavern.svg	60772e14-0028-4c5e-9411-f8ddf8a6c03b	f	\N	f	TAVERNE_AUBERGE
3a9e4197-db86-419a-9143-ff5cb489213d	Sanctuaire au dragon	Sanctuaire drakonien taillé à même la montagne de l'Antre, chef-d'œuvre de l'architecture locale. Lieu de culte de Tiamat.	4d37eed1-161e-4156-970c-381793c3d614	\N	/Icon/place.png	\N	f	\N	f	AUTRE
961fbde9-43d6-4db5-ab3e-88b6632cdb5c	Les Cendres	Immense cratère causé par une bombe gnome qui mit fin à la résistance de l'Antre. Lieu mémorial intact depuis l'explosion, où des cadavres seraient encore cristallisés.	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	/Icon/place.png	\N	f	\N	f	AUTRE
d20173dc-ba36-4e9d-bcfe-f14c0538f9fb	Nécrole (École de Nécromancie)	Dernière école de magie de nécromancie de Solenia, dissimulée sous le quartier des Trois Cafards à Brodnica. Dirigée par Ayas Sarwens.	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	/Icon/place.png	\N	f	\N	f	AUTRE
58242ace-5dbd-444d-8692-e0dfb8bf032b	Temple Noir	Plus grand bâtiment d'Iserna, dédié à l'art de l'enchantement. La croyance populaire y voit d'un mauvais œil ce lieu où l'on manipule les esprits.	\N	f9f210bd-a735-4acc-a72e-701aea69750b	/Icon/place.png	\N	f	\N	f	AUTRE
441573b4-db5c-4d34-a78f-91b0a71bbb8f	Palais d'Elvaltis	Résidence officielle de la famille Elvaltis, gouverneurs de Kalanos. Bâtiment en marbre et ardoise orné de fresques représentant l'histoire de la ville.	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	/Icon/place.png	\N	f	\N	f	AUTRE
f0c920a5-6ac0-4547-80f5-5a36778cd1a2	Temple de Tal Odius	Principal lieu de culte de Kalanos, façade ornée de statues en ardoise blanche. Centre spirituel de la ville tenu par la grande prêtresse Elivara Tanis.	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	/Icon/place.png	\N	f	\N	f	AUTRE
594bcec6-5c3b-43a2-98b5-1a2a590bb085	Carrières de l'Ardoise Blanche	Exploitation principale de Kalanos, surveillée par des gardes impériaux. Dégagement de carrières ayant mis au jour une immense caverne aux ruines de l'âge de sérénité.	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	/Icon/place.png	\N	f	\N	f	AUTRE
20a26041-31b1-415a-901d-65bf212fa430	Ruines de l'Âge de Sérénité	Caverne souterraine sous Kalanos contenant les ruines d'une ville de l'âge de sérénité, découverte lors des excavations d'ardoise. Découpée en trois zones explorées par Maeltor Elvaltis.	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	/Icon/place.png	\N	f	\N	f	AUTRE
2f181951-ec63-4895-b33e-1e2303722d53	Les Abysses Murmurants	Type (lore) : ruines.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
909d7a50-2e47-47e5-94dd-dc5b8f9a52e1	la Mésange Fringante	(fréquentée principalement par une race spécifique Nain)\n\nLe bâtiment en forme de H est composé d'un unique rez-de-chaussée, la construction est correcte. A l'intérieur, se trouve une salle pouvant contenir 30 personnes. Au devant de l'auberge, quelques tables et chaises permettent de prendre un verre à l'extérieur.\nDans cet établissement viennent souvent des voyageurs cherchant une escorte, de plus la proximité d'un temple d'une divinité bonne, amène souvent de braves gens.\n\nServices disponibles :\nchambre : 3 pièces avec des commodités agréables\npalefrenier : 1 - soignera et nourrira les chevaux convenablement\nsoigneur : 1 - pouvant lancer des sorts de soins faibles\nrations sèches : permettant de se sustenter durant les longs voyages\nbarbier : 1 - exécute son travail convenablement\nbarde : 1 - pour quelques piécettes, chante	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-tavern.svg	118b0713-e8c3-4dec-ad03-ba76cfe63900	f	\N	t	TAVERNE_AUBERGE
17a3d98b-2d91-499f-8096-439d6b810ce8	Sanctuaire au dragon (montagne taillée)	Type (lore) : temple.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
ae31c790-cdce-4e3b-baaa-9b680a52ff84	L'Étreinte du Vent	Type (lore) : organisation-lieu.\n\nGrande congrégation d'assassins fanatiques au sud (doc).	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
04121a12-f155-4a1f-90ec-b72563c75507	Palais du comte Esebio	Type (lore) : palais.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
0f84db1e-eeb4-467c-bfd6-ae5e83abbdf8	École de nécromancie (sous Les trois cafards)	Type (lore) : ecole.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
65b1535b-b040-4e90-bc3f-25734e675ae1	Fonderie Royale (de la Momoritanie)	Bâtiment massif à l'architecture impériale Momoritanienne — colonnes de marbre blanc striées de filaments dorés, toiture en tuiles d'ardoise grise, fronton orné du sceau impérial à l'aigle bicéphale. L'édifice se dresse dans le quartier bancaire de Huriya, protégé par une double enceinte de grilles en fer forgé et des gardes en armure complète arborant les couleurs de l'Empire.\n\nÀ l'intérieur, les ateliers de frappe sont répartis sur deux niveaux. Les flans de métal précieux sont livrés sous escorte depuis les entrepôts de l'artère fluviale. Chaque pièce frappée ici porte le profil du Commandant Suprême Momoritanien et la devise impériale : « Par la force, la prospérité. »\n\nLes audits trimestriels menés par un inspecteur impérial depuis la capitale sont craints de tout le personnel. La fonderie emploie une vingtaine d'artisans, tous Momoritaniens de naissance, et ne recrute jamais en dehors de l'Empire. L'entrée est strictement contrôlée ; les visiteurs sans accréditation officielle ne franchissent pas le hall d'accueil.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
555b341a-0b2c-4983-8c51-186d9adde148	Citadelle Rouge	Immense bastion circulaire adossé à la muraille nord d'Alagir. Quartier général du Soleil Pourpre, il abrite les salles d'entraînement, les dortoirs militaires, les salles de commandement et les chambres d'initiation.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	/Icon/place.png	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
8051841f-52e4-4d8d-91d6-ff4af5ed3070	Chambres de la Lumière Totale	Sous les fondations de la Citadelle Rouge se trouvent des chambres d'initiation où les recrues sont exposées à un cristal pourpre censé purifier leur esprit. En réalité, ce rituel les lie progressivement à la volonté du Roi et au réseau psychique du Tyrannœil.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	/Icon/place.png	a3bd30af-d091-4c93-846e-14e869ce69e5	t	\N	f	AUTRE
74267976-27df-4d73-b736-b72bf1ddb19f	La Valkyrie Rayée	Enseigne incontournable du quartier des Forges-de-Monnaie, La Valkyrie Rayée tient son nom d'une mercenaire légendaire dont les bandes de peinture de guerre noire et or terrifiaient ses ennemis. La boutique est tenue par Sorqa Drenval, une naine aux bras couverts de tatouages runiques, ancienne lieutenant de Garnison.\n\nLes vitrines sont protégées par des glyphes d'alarme discrets ; chaque arme est présentée sur un présentoir de velours cramoisi. L'endroit dégage une odeur d'huile d'affûtage et de magie de renforcement.\n\n**Articles disponibles (prix indicatifs)**\n\n*Armes et armures enchantées*\n— Épée longue +1 (500 po)\n— Épée courte +1 (350 po)\n— Arc court +1 (400 po)\n— Hache de guerre +1 (500 po)\n— Armure de cuir +1 (1 200 po)\n— Armure de mailles +1 (2 500 po)\n— Bouclier +1 (750 po)\n\n*Objets merveilleux*\n— Gants de puissance des géants – Force 19 (4 500 po)\n— Bottes elfiques (2 500 po)\n— Amulette de santé (4 000 po)\n— Cape de protection +1 (750 po)\n— Anneau de protection +1 (2 000 po)\n— Ceinturon de la force du colosse +2 (2 000 po)\n\n*Service* : Identification d'objet (50 po/objet), affûtage magique temporaire +1 pendant 24h (100 po).	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-magic.svg	\N	f	\N	f	MAGASIN_MAGIE
bcd0f4f4-c967-4184-a201-1bd7e0d3d88e	La Plume du Corbeau	Nichée dans une ruelle pavée du quartier des Scribes, La Plume du Corbeau est une échoppe en apparence modeste — façade sombre, vitraux teintés de violet, une plume de corbeau argentée en guise d'enseigne. À l'intérieur, des milliers de parchemins, fioles à encre magique et curiosités emplissent des étagères qui semblent ignorer les lois de l'espace.\n\nLa propriétaire, Essel Vaanmyr, est une elfe haute d'âge indéterminable, aux doigts constamment tachés d'encre violette. Elle est connue pour refuser de vendre à quiconque lui paraît d'intentions douteuses — et elle se trompe rarement.\n\n**Articles disponibles (prix indicatifs)**\n\n*Parchemins*\n— Sorts de niveau 1 : Identification, Détection de la magie, Projectile magique, Bouclier (60 po chacun)\n— Sorts de niveau 2 : Force fantasmagorique, Immobilisation de personne, Pas brumeux (130 po chacun)\n— Sorts de niveau 3 : Dissipation de la magie, Boule de feu, Contresort (250 po chacun)\n\n*Baguettes*\n— Baguette de projectiles magiques (7 charges, 1d6+1 par projectile) (400 po)\n— Baguette de détection de la magie (5 charges) (200 po)\n\n*Objets merveilleux*\n— Sac sans fond (type II) (2 500 po)\n— Lunettes de nuit (1 500 po)\n— Chapeau de déguisement (1 800 po)\n— Anneau de chute ralentie (800 po)\n— Pierre ioun (absorption des sorts, 2 charges max) (3 500 po)\n— Orbe de clairvoyance (usage unique) (500 po)\n\n*Service* : Copie de sort dans un grimoire (coût du parchemin + 50 po), traduction de textes anciens (tarif selon longueur).	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-magic.svg	\N	f	\N	f	MAGASIN_MAGIE
b2a3649c-ddc3-45a0-98fb-1f2453713afd	La Prophétie	Contrairement à la Grenouille Royale, La Prophétie ne s'adresse pas aux clients pressés. Ici, tout est lent, rituel, chuchoté. Les murs sont couverts de cartes astrologiques, les fioles flottent dans des présentoirs en lévitation légère, et une musique de bol chantant emplit l'espace en permanence.\n\nIlseva Dawnthread, la propriétaire — une humaine aux cheveux blancs malgré ses quarante ans à peine —, prétend que chaque potion qu'elle vend correspond à un destin. Elle est rare, excentrique, et ses produits sont hors de portée pour la plupart. Mais quand on cherche quelque chose d'introuvable ailleurs…\n\n**Articles disponibles (prix indicatifs)**\n\n*Potions rares*\n— Potion de soins supérieure (150 po)\n— Potion de soins excellente (450 po)\n— Potion d'héroïsme (180 po)\n— Potion de vitesse (400 po)\n— Elixir de santé (120 po)\n— Potion de lévitation (200 po)\n\n*Potions très rares (stock limité)*\n— Potion de vol (500 po)\n— Potion de clairvoyance (300 po)\n— Huile d'éthéréité (1 500 po)\n— Potion d'invulnérabilité (3 000 po)\n\n*Curiosités rituelles*\n— Eau bénite (25 po la fiole)\n— Encens de purification (30 po les 3 bâtonnets)\n— Poudre de destin (effets aléatoires — table secrète) (200 po)\n— Symbole sacré de fortune (non magique mais chargé d'intention) (80 po)\n\n*Service* : Lecture des augures pour guider un achat (50 po — surtout décoratif), préparation d'une potion sur mesure si les ingrédients sont fournis.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-herb.svg	\N	f	\N	f	HERBORISTE_APOTHICAIRE
8fc56667-67a4-426f-ad49-8edf2c48c9bf	La Grenouille Royale	La Grenouille Royale est l'apothicairerie la plus ancienne et la plus fréquentée de Huriya. Son enseigne — une grenouille couronnée tenant une fiole — est reconnaissable de loin. L'intérieur est un foisonnement joyeux de bocaux colorés, de plantes séchées, de peaux de serpent et de fioles en rangées ordonnées du sol au plafond.\n\nBarros Mullimax, le propriétaire (cousin de Tobrin Mullimax de la Garnison), est un halfelin jovial qui connaît chaque potion par cœur, leur origine, leur durée de conservation et leurs effets secondaires rares. Il prépare lui-même la plupart de ses stocks à l'arrière-boutique.\n\n**Articles disponibles (prix indicatifs)**\n\n*Potions standard*\n— Potion de soins (50 po)\n— Potion de soins supérieure (150 po)\n— Potion de soins excellente (450 po)\n— Antitoxine (50 po)\n— Huile alchémique enflammée (50 po)\n\n*Potions spécialisées*\n— Potion d'escalade (75 po)\n— Potion de souffle aquatique (180 po)\n— Potion de résistance (feu, froid, foudre, acide — au choix) (300 po)\n— Potion de force du géant des collines (200 po)\n— Potion de croissance (200 po)\n— Potion de réduction (200 po)\n\n*Ingrédients alchimiques*\n— Composants courants (herbes, huiles, acides) (1–10 po l'unité)\n— Kit d'alchimiste de rechange (50 po)\n\n*Venin*\n— Poison de base (fiole) (100 po)\n— Poison de sommeil (150 po)\n\n*Service* : Analyse d'une substance inconnue (25 po), préparation sur commande sous 48h.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-herb.svg	\N	f	\N	f	HERBORISTE_APOTHICAIRE
a125f5fb-f383-4013-9124-5b045718d5d9	La Frappe Brillante	L'une des plus anciennes fonderies privées de Huriya, fondée il y a trois générations par la famille Torfin. Façade modeste en brique rouge, enseigne en laiton poli représentant un marteau de frappe illuminé par un soleil stylisé. L'intérieur est chaleureux et fonctionnel — odeur de métal chaud, bruits sourds des presses manuelles, lumière jaune des fourneaux.\n\nLa Frappe Brillante ne concurrence pas les fonderies royales sur le volume ; elle s'est spécialisée dans les niches que les grandes structures dédaignent : médailles commémoratives personnalisées, sceaux en métal pour particuliers, petites séries de jetons pour tavernes ou guildes locales, réparation et remplacement de pièces anciennes.\n\nSa réputation est excellente : les Torfin ne bâclent jamais un travail et honorent les délais annoncés. La fonderie emploie cinq artisans permanents et deux apprentis.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
648113c1-93ea-4f74-8786-318fed58f4c8	Fonderie Royale (de Gandorenne)	Édifice élégant aux proportions harmonieuses, typique de l'architecture civile du Royaume de Gandorènne : façade en calcaire clair, fenêtres en ogive, tourelles d'angle ornementales, et un blason gandorennais — une fleur de lys argentée sur fond d'azur — incrusté au-dessus du portail d'entrée. Contrairement à la fonderie Momoritanienne voisine, l'atmosphère ici est moins militaire et plus institutionnelle.\n\nLes pièces gandorennaises frappées à Huriya circulent principalement dans les régions frontalières et les cités libres. La fonderie emploie un mélange d'artisans gandorennais et locaux, ce qui en fait un lieu de brassage culturel mesuré. Le Maître-Frappeur en chef entretient des relations cordiales avec les autorités de Huriya et les autres fonderies de la ville.\n\nLa fonderie propose également un service de change officiel pour les pièces étrangères en monnaie gandorennaise, moyennant une commission de 3 %.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
df3fc552-d2a7-4722-b627-367b28740fe5	Fonderie de contrefaçon du Conseil d'Acier	En surface, une cave à vin ordinaire en sous-sol d'un entrepôt appartenant à un prête-nom du Conseil d'Acier. En dessous, à travers une trappe dissimulée derrière une étagère pivotante, se trouvent trois salles basses aux murs couverts de suie. Des moules d'impression et des presses à coins y sont stockés, capables de reproduire avec une précision troublante les pièces des deux fonderies royales.\n\nLes contrefaçons produites ici sont de qualité exceptionnelle — un ratio d'alliage savamment calculé pour être indétectable au test standard de l'acide, mais légèrement sous-dosé en métal précieux. Elles sont écoulées via les réseaux commerciaux du Conseil dans toute la région.\n\nL'atelier ne travaille que la nuit, ne produit que par petites séries, et change d'emplacement tous les quatre à six mois. L'entrée par la cave est marquée d'un glyffe discret — deux barres horizontales gravées dans le mortier de la deuxième marche.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	t	\N	f	AUTRE
0c4d671e-5e18-48f2-b75f-d4e4402a9433	La Monnaie du Dragon	La plus imposante des fonderies privées de Huriya. La façade est spectaculaire : deux colonnes de basalte noir flanquent une porte en bronze gravée d'un dragon enroulé autour d'une pièce d'or, à mi-chemin entre le symbole et l'avertissement. L'intérieur conjugue l'opulence marchande et la précision artisanale — sols en marbre noir veiné d'or, vitrines exposant des pièces et médailles rares, atelier de frappe visible depuis une galerie vitrée surplombant la salle principale.\n\nLa Monnaie du Dragon est détenue par la famille Aurodent, une lignée de drakoïdes installée à Huriya depuis quatre générations. Leur spécialité : les pièces commémoratives de prestige, les lingots certifiés, et le monnayage privé pour les grandes familles marchandes ou les guildes qui souhaitent leur propre monnaie interne.\n\nIls proposent également un service de fusion et de certification de métaux précieux et achètent les objets d'art en métal à prix raisonnable.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
3224c898-95b2-4737-b460-969d81c1e5bc	Le Creuset des Richesses	Fonderie privée haut de gamme doublée d'une maison de change discrète. La façade ne paie pas de mine — une vitrine en verre épais opacifié, une plaque de cuivre gravée au nom de l'établissement, une sonnette. Par invitation ou sur recommandation seulement.\n\nL'intérieur révèle un atelier d'une propreté chirurgicale équipé de creusets en céramique spécialisée, de balances d'une précision exceptionnelle et d'un laboratoire d'analyse alchimique permettant de certifier la pureté des métaux précieux jusqu'au millième. Le Creuset des Richesses propose trois services principaux : la certification de métaux précieux (lingots, bijoux, pièces douteuses), la refonte confidentielle (transformer un lot d'objets en métal brut non traçable, service très demandé), et le monnayage privé de prestige.\n\nSa clientèle est composée de grandes familles marchandes, de guildes importantes et de personnalités souhaitant la discrétion absolue.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
d280b9fb-1b1b-4bcd-9aa0-eaa43700a4fb	Fonderie de L'Écus d'Or	Bâtiment robuste aux murs épais de granit gris, intégré dans le complexe de la Citadelle Rouge. Moins ornée que ses rivales royales, la Fonderie de l'Écus d'Or privilégie la fonction à l'esthétique : des portes blindées, des fenêtres à barreaux, des postes de garde permanents. Son enseigne est sobre — un écu d'or gravé en bas-relief sur une plaque de bronze au-dessus de l'entrée.\n\nFinancièrement, elle est le cœur économique de la Garnison. Elle ne frappe pas de monnaie souveraine mais produit des jetons officiels de la Garnison (utilisés pour les salaires et les transactions internes), des médailles commémoratives militaires, et gère le change pour les soldats et les marchands escortés.\n\nElle propose également un service de stockage sécurisé (coffre-fort sous garde permanente) très prisé des négociants de passage à Huriya.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
de47dbe3-1415-4c22-9559-cb0b280e584c	Grand temple de Ral Ibris	Ral Ibris est le dieu des contrats, des serments et de l'échange équitable — une divinité particulièrement vénérée dans les cités commerçantes et les places financières. À Huriya, dont toute l'économie repose sur la frappe de monnaie et la diplomatie, son culte est profondément ancré dans la vie quotidienne.\n\nLe Grand Temple occupe une position symbolique au cœur du quartier bancaire : façade en grès rougeâtre, portique à six colonnes lisses, fronton gravé de la balance à deux plateaux — symbole de Ral Ibris — surmontée d'un œil ouvert représentant l'impartialité divine. L'intérieur est sobre mais impressionnant : haute nef, sol en damier noir et blanc, autels latéraux dédiés aux aspects secondaires de la divinité (les serments guerriers, les contrats d'alliance, les dettes d'honneur).\n\nAu cœur du temple, la Chambre du Serment : une petite pièce circulaire où les contrats importants sont signés sous le regard du clergé. Ces serments ont une valeur légale reconnue dans toutes les cités libres et la plupart des royaumes. Briser un contrat signé dans la Chambre du Serment est considéré comme un sacrilège passible d'excommunication et de malheur divin.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	\N	f	\N	f	AUTRE
a01e87b0-94ca-42ed-9371-f5a5d4a411bb	L'Oracle du vin	(taverne aristocrate)\n\nL'Oracle du vin est une taverne tranquille et accueillante. À travers les murs peints, on peut entendre des rires.\nEn ouvrant la lourde porte de la taverne, on est accueilli par l'odeur du pain frais et par un petit groupe de clients. L'intérieur semble tout aussi accueillant que l'extérieur. La pièce est éclairée par un lustre magique suspendu au plafond. Derrière le bar en marbre se tient un gnome des rochers maigre de 1,80 m, au visage nerveux, aux cheveux bruns très longs et raides, aux yeux bleus et à la peau douce et bronzée. Il porte une tunique bronzée et un pantalon blanc.\nEntre vous et le barman se trouve une série de tables bien conçues, à droite un foyer avec une flamme rugissante à l'intérieur, et à gauche un long escalier.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place-tavern.svg	0a070760-36fd-43de-9b3f-5be9b9c52c41	f	\N	t	TAVERNE_AUBERGE
23f62138-662c-47d5-855d-bdf7acf09462	tertre des Ombre	<p>17 Entré</p><p>Traces récentes au sol confirmant le passage du PNJ.</p><p>16 Entrée du Tertre</p><p>Linteau gravé de runes de malédiction. Traces fraîches dans la poussière — le PNJ est passé récemment. Deux squelettes effondrés en faction depuis des décennies.</p><p>15 Vestibule des offrandes</p><p>Niches avec des crânes. Autel brisé. Fosse dissimulée (Perception DC 14). Fresque montrant le mage de son vivant.</p><p>18 Cellule de garde abandonnée</p><p>Ossements d'un aventurier passé avant les joueurs. Un carnet illisible sauf les derniers mots : "il est encore vivant là-dedans".</p><p>13 Bibliothèque effondrée</p><p>Un seul tome a survécu : journal du mage. Y figure le mot de passe de la salle 7, et la révélation que le cœur ressuscite quiconque tente de le voler — le PNJ ne le sait pas encore.</p><p>Une page arrachée, glissée entre deux chapitres, raconte comment Zarak Solara abattit un cavalier Beor Khan monté sur un pégase lors de sa conquête des steppes, et fit tanner la dépouille de la créature en cape — trophée destiné à humilier le peuple qui avait osé lui résister. Le nom du cavalier y est noté avec mépris : Vaskar Skoren, « le Cavalier du Ciel ».</p><p>14 Réserve à potions</p><p>Fioles anciennes : d50 — 1-20 encore bonnes, 21-40 empoisonnées, 41-50 explosives (3d6 feu).</p><p>5/6 Passage des Illusions</p><p>Couloir rempli d'illusions sonores (Intelligence DC 13). piège 2d6 acide Dex DD 13</p><p>10 Sanctuaire du Mage</p><p>Statues du mage à son effigie la tête est arraché et l’endroit a la place du coeur suiainte du liquide noir. L'une cache un passage secret vers la salle 22. L'une d'elles est un Mimic.</p><p>11 éboulement pièce inaccessible</p><p>12 Laboratoire nécromantique</p><p>Chaudron encore actif (poison, Constitution DC 15). 1 zombie en fabrication qui se lèvera à l'entrée. Note laissée : les expériences visaient à transférer une âme dans un objet — le cœur.</p><p>8 Salle des Mages (mutilé)</p><p>Équipements des aventuriers tombés ici, exposés comme trophées. Armure +1 récupérable mais maudite (Arcanes DC 14).</p><p>Sur un des cadavre de mage, une cape faite de peau et de plumes de pégase — la dépouille de la monture de Vaskar Skoren. Elle confère au porteur une chute plane et, une fois par jour, l'usage de Vol (1 minutes). La décrocher sans prononcer les paroles funéraires beor khan (transmises par Sylvae Irithiel) libère l'esprit du pégase, lié à l'objet depuis des décennies : un spectre équin hostile (profil de Spectre, vitesse de vol 40 ft.) qui ne se calme que si on lui rend son honneur (Religion ou Persuasion DC 15, ou preuve que le porteur agit au nom des Beor Khan).</p><p>9 Salle de préparation des cadavres</p><p>Contient des outils pour d'embaumement</p><p>4/7 Crypte des serviteurs</p><p>Cercueils de pierre scellés — les serviteurs enterrés vivants. S'ouvrent si on s'approche de trop près (Perception DC 12 pour entendre le raclement).</p><p>3 Carrefour du Mausolée</p><p>Croisée centrale. Torches magiques qui s'allument seules à l'approche.</p><p>2 Salle du golem d’Aléthérite vaincue. investigation DD 15 (ou arcane mais a déavantage) Beaucoup de sang et morceau de cadavre tu estimé à 5 cadavres de non mort</p><p>1 éboulement pièce inaccessible</p><p>19 Première partie de l’histoire de Zarak Solara</p><p>20 Seconde partie de l’histoire de Zarak Solara</p><p>21 Salle des Statues</p><p>Quatre Armures Animées (Animated Armor). Détruite de grande explosion marque la pièce</p><p>25 Antichambre des Runes</p><p>Deux runes actives : l'une téléporte vers la salle 16, ferme/ouvre l’entrée de la salle 24. Arcanes DC 16 pour les distinguer.</p><p>22 Salle inondée sol effondré</p><p>Terrain difficile (eau). Un Ghoul aquatique. Sous l'eau : coffre contenant le sceau de mort — clé pour détruire le cœur.</p><p>23 (rouge) Chambre de Purification</p><p>Pentagramme au sol — 2d6 nécrotiques si traversé sans le mot de passe (trouvable en salle 13). Miroir magique montrant une vision du mage vivant.</p><p>24 La Chambre du Cœur (boss)</p><p>Salle circulaire. Le cœur bat dans un reliquaire de verre noir. Le PNJ est en transe, absorbé par le cœur. Trois issues : briser (réveille le Spectre), sceau de mort (salle 20, détruit le cœur), ou prendre le cœur (le porteur commence à entendre des murmures)</p>	\N	\N	/Icon/place-dungeon.svg	\N	f	/maps/a4ee5f90-5340-4ba9-a194-dfabe61fadae.svg	t	DONJON_CAVERNE
c8465912-0c2c-41b2-ad4e-ff3d5216fee1	Manoir des Trois Carrières	Siège de la Famille Tovalis, au flanc ouest des Monts Rouges. Bâtisse robuste en marbre pourpre veiné. Centre de décision de toutes les guildes minières et de transport d'Alagir.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
7ba3af96-e3be-4a24-a635-4019fd735b43	Couronne de Platine	Banque d'État d'Alagir, principal pilier du Trésor Royal. Dirigée par Garran Cilovard. Frappe des monnaies, financement des infrastructures, dette publique. Sous-sol : le Comptoir de Résonance — amplificateur psionique du Roi-Tyrannœil à l'insu des employés.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	AUTRE
7c5c384e-7ceb-4519-a8ec-306461834613	Caisse des Richesses Cachées (C.C.R.C.)	Institution semi-religieuse fondée par Velena Cilovard. Coffres individuels à secret, salles de comptes anonymisées. Siège : Place Sombre. Offre des fonds de charité aux temples en échange de faveurs. Certains registres s'écrivent parfois seuls, en encre rouge.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
2cf8aa39-28d2-4c27-bf2a-a9d5330354f6	Carrière Écarlate	Carrière à ciel ouvert dans les Monts Rouges. Veines de marbre compactes de couleur écarlate vif. Maître-carrier : Torv Arkhammar. Risques : glissements, poussière cramoisie (Sauvegarde Con DD 12 ou Désavantage Perception 1 h).	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
06749d5e-ec84-4015-a156-ab1ad1b3a7a4	La Place Sombre	Quartier du port, dans le Chant de Tal Taris. Siège local du Syndicat d'Alagir et de la C.C.R.C. Zone contrôlée par Faith la Grise la nuit. Aucun navire ne quitte Alagir sans le sceau secret du Syndicat.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
e445a4a2-d1e3-4547-8dd7-4c9faf3e7463	Bastion Gris	Forteresse souterraine dissimulée sous la Cinquième Roue. Siège du Conseil d'Acier à Alagir. Un rituel nocturne y est pratiqué chaque nuit : les membres frappent trois fois un mur d'acier, jurant « par la pression, la forme et le silence ».	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	DONJON_CAVERNE
756ac544-47ef-4c00-9236-6fe3efd3792e	La Garde-Fente	Caserne principale du Soleil Pourpre dans la Porte Pourpre. Point de commandement des patrouilles de la ville haute. Quartier général de la Commandante Sahi « Lame-Cramoisie ».	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	AUTRE
c7279c93-060a-4b73-906a-4353b2ce1f15	Hangar du Poids	Entrepôt et lieu de réunion hebdomadaire du Conseil des Contremaîtres Tovalis, sur la Cinquième Roue. Sert à la répartition des tâches, sécurité des galeries et discipline ouvrière.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
b3b0f2aa-5124-4985-bf1f-d07bf3097628	Cour des Ambassades	Quartier neutre entouré de verreries et jardins. Accueille les envoyés du Saint-Empire, de Gandorènne et d'Huriya. Salle de négociation circulaire : La Rotonde des Reflets. À certaines pleines lunes, les murs en verre renvoient un motif que personne n'a gravé : une balance fendue.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
b393fd0f-f2e5-47b9-964a-cf332114835c	les 3 moustiquaire	\N	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
fd8ed968-cfd3-4d8b-a06f-f65097ae8f5b	Grand Temple de Tal Odius	Basilique de marbre veiné, nef basse, colonnes « racines ». Clergé de Tal Odius, carriers Tovalis. Secret : dalle pivotante sous l'autel vers crypte d'alignement — pendule accélère quand l'influence du Roi croît.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
56908e36-4174-48be-8397-0d49c9ce0c69	Oratoire de Ral Zitris	Étage discret au-dessus de la Maison des Listes. Autels bas, dés rituels, balances votives. Dés taillés dans des éclats du Vitrail du Pacte — scintillent devant un serment parjure.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
b9e6dc77-25ec-44f4-84e6-c34623e647c9	Hôtel des Pesées	Inspecteurs, poinçons, litanies du poids. Pierre pourpre en crypte incline imperceptiblement les balances selon l'influence occulte du Roi.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
f5b539bf-f8fe-40ec-be80-fae92e62bfeb	Maison des Listes	Babillard des taux, primes, taxes, valeur du marbre. Temple discret Ral Zitris au dernier étage. Chiffres parfois réécrits sous fragment de vitrail.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
28977457-6c67-47c0-a9eb-385fbe0d15c1	Marché des Voiles	Hall couvert : cordages, caisses, promesses à voix basse. Dalles piégées transmettant sons à un grenier d'espions.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	\N	f	AUTRE
0424792b-e344-42cd-988c-146b68038dfb	Arène des Éclats	Rotonde enterrée, gradins, éclats de verre dans le sable. Combats illégaux. Éclats absorbent larmes de sang — le Roi lit les souvenirs au Château.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	\N	f	AUTRE
ad9221dc-540b-401c-a972-ba2b61c8ebe3	Académie des Médiateurs	École diplomatique Palhindile formant médiateurs, orateurs et traducteurs. L'art de la négociation s'y enseigne comme un sacerdoce. Officially educational, it secretly trains diplomate-mystiques qui croient en la résonance des serments.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
442b74a9-f192-4061-be65-0229e70889e9	L'Œil d'Étain	Les Comptes de Zitris, ruelle de la Balance. Magasin étroit et profond, bougies vertes et vitrail d'œil stylisé. Étagères de grimoires, fioles, loupes et plumes animées. Petites créatures de métal (araignées, papillons, rats d'étain) nettoient et classent les objets. Spécialités : objets utilitaires, réparation d'artefacts, composants rares, traçage magique de résidus arcaniques. Clientèle : scribes, marchands, jeunes mages, Syndicat.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	MAGASIN_MAGIE
e61af0df-fecc-48a5-993b-d8f36ef79021	Le Souffle d'Obsidienne	Quartier des Tentations, ruelle du Masque Fendu. Devanture noire mate, lanternes de verre fumé. Intérieur chaud : cannelle, soufre, musc, fleurs fanées. Étagères de pierre volcanique, fioles, poudres, statuettes serpentines. Spécialités : parfums alchimiques (charme, peur, sincérité, oubli), encens psioniques, herbes et huiles enchantées, potions de charme ou combustion émotionnelle. Clientèle : espions, courtisans, Syndicat.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	\N	f	MAGASIN_MAGIE
8507526b-0c7e-4d3a-bd95-8f4d47c1f8d7	L'Herbe & le Sablier	Jardins des Âmes. Mi-herboristerie, mi-atelier d'antiquaire. Plantes suspendues, bocaux empilés, montres et sabliers au plafond. Sol pavé de carreaux gravés de symboles différents. Spécialités : plantes médicinales, herbes de chance, talismans d'ancrage, encens de purification, restauration d'objets anciens, analyse d'aura végétale. Secret : sous le plancher, une racine vivante de l'Arbre de Tal Odius arrosée d'une goutte de son sang chaque lune.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	HERBORISTE_APOTHICAIRE
145ee62b-6bcb-49d2-b728-15f421f7782e	Le Cabinet du Silence	Porte Pourpre, caché derrière la Caisse des Richesses Cachées. Façade sans enseigne, porte de bois sombre encadrée d'onyx. Intérieur silencieux : tentures noires absorbent le son, vitrines en cristal, lumière froide bleutée. Spécialités : objets magiques rares (armes muettes, bagues d'oubli, fioles de silence), souvenirs encapsulés, effacement émotionnel ciblé. Clientèle : aristocratie, espions du Roi, Cilovard. Rumeur : Dovren n'aurait pas d'ombre — mais son reflet dans la vitre bouge encore après son départ.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	MAGASIN_MAGIE
9ffe2919-51a4-4ec3-92a2-4af55fa1355f	Rotonde des Reflets	Salle circulaire de la Cour des Ambassades. Parois de verre captant la lune. À la pleine lune : une balance fendue affleure brièvement dans le verre, sans que nul sache d'où vient le motif.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
c79aa2b9-2f0a-4aca-a7a2-e8f3a301c6d7	Entrepôts du Pourpre	Hangars, chariots, fumée. Tovalis et Conseil d'Acier. Faux mur vers le Bastion Gris.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
ac5fdf5d-4195-42a7-8a86-9d8c964336e1	Four « la Gueule d'Aube »	Principal four des Verreries Royales (Lior). Chante quand la pâte prend. Bâti sur une faille de pouvoir : nourri d'un serment, le vitrail correspondant devient vivant.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
199430ce-4977-47bb-9bf8-9a5eb922adad	Cercle du Verre Clair	Ordre moral et éducatif de Serenya. 23 membres : diplomates-mystiques, vitraux vivants. Rites de la Transparence — dont les officiants ne mesurent pas ce qu'ils relaient.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
4001bd74-56fb-4909-82dc-1eef5feeac39	Docks des Lunes	Quai pour navires sans pavillon. Vagues chuchotantes la nuit. Chambre noyée : mini-sanctuaire de Tal Taris.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	\N	f	AUTRE
d32f0ae0-88a5-418b-b70f-6e3d56a633e0	Comptoir des Lunes	Taverne banale en façade ; cave : cartes nautiques vivantes, coffres scellés. Planque Syndicat (Sarlis Nym). Sacs runiques résonnent avec coffres du palais.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	\N	f	TAVERNE_AUBERGE
418977aa-45be-435b-9efe-ab69fed14ac0	Bureau des Scellés & Contreseings	Cachets, sceaux, droit de signature. Sceau perdu d'un roi précédent peut annuler un décret royal avec sang royal ou équivalent.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
233d4e8f-b373-4a1d-88f0-b3fbb74d2329	Marché des Mille Voix	Croisement couvert : tout ce qui échappe aux registres officiels.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
c9077e67-1cef-4fc0-9395-5cd1e5aaa7eb	Salle du Miroir Froid	Salon privé Cilovard. Murs de verre gris. Reflets transportent échos de voix jusqu'au Château.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	AUTRE
8f6fe71d-a75c-4235-96da-9b4c65bebe0b	Dépôt des Serments Inachevés	Sous la Chancellerie. Pactes brisés qui « pleurent ». Serment réactivé maudit le traître 1d4 jours.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
2587a572-d2c8-48ff-8f4b-37e2d8c4f9a6	Le Miroir des Masques	Ancien théâtre. Salle invisible : clients sortent vidés de volonté. Expérimentations psioniques du Roi.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	\N	f	AUTRE
1ec106e1-0f0e-4f06-a410-b12f08c2196a	L'Œil de Verre	Casernement royal du Soleil Pourpre au Château. Chambres d'initiation à la Lumière totale.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
87c3e055-157a-4dab-b802-05e9219f7327	Puits du Serment Inachevé	Sous la Chancellerie. Nom chuchoté devient juridiquement contraignant 1 jour.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
e264e684-1f9f-449f-8174-dafafc097359	Larmes de Ral Zitris	Banque du culte Ral Zitris. Obligations de rançon, dépôts judiciaires. Dir. : Prêtre-auditeur Yovan Kelep.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
13aa2067-8d79-4e62-95f8-96e49e059fe9	Banque du Dragon d'Or	Escompte et lettres de crédit longue portée (Huriya, Levant). Dir. : Saphira Tel-Olem.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
1688db92-616d-4198-ad53-a0be9ceedcba	Le Calepin Ébréché	Cantine des scribes, Comptes de Zitris. Encre, cire, feuillets collés aux murs. Tourte à l'encre, vin gris, café à la plume. Registre comptable signé d'un nom inexistant.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	TAVERNE_AUBERGE
ab0c8d88-3f3b-41cc-809f-3cde159f2fad	La Roue de Secours	Auberge des convoyeurs. Bière rouge à la poussière sucrée, cour pour chariots. Chariot royal disparu avant inspection.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	TAVERNE_AUBERGE
52c62675-fc63-422a-9a18-ec13ca8256b8	Les Vapeurs d'Olena	Bains et suites, Tentations. Mosaïques turquoise, brumes, jeu La Balance. Bassins changeant à la pleine lune — œil sous la surface.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	\N	f	TAVERNE_AUBERGE
d8ee7264-dfaa-4851-81dc-d94e529ad548	Le Marteau Courtois	Taverne-forge du Conseil d'Acier. Marteau sacré : trois coups lient l'âme 30 jours. Ragoût de braise, bière Poing de Fer.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	TAVERNE_AUBERGE
55939ea9-a45e-42b4-8603-ded4f2701070	La Verrière Fendue	Terrasse face au Château. Tarte de marbre, vin Larme du Verre. Fissure projetant parfois la vraie forme du Roi.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	TAVERNE_AUBERGE
c287aadd-d73e-43b5-8223-813e59ed8350	Le Poids Juste	Taverne sobre, balances au plafond. Bière Juste Mesure. Pièces changeant de poids après minuit (monnaie enchantée du Roi).	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	TAVERNE_AUBERGE
d902d048-c851-4cc8-b19e-5936ccf928b7	La Vigne Noire	Salle de jeu, masques dorés. Vin le Serment. Masques absorbent émotions des perdants pour l'Œil Pourpre.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	7df130bd-3682-4c93-9412-a31f75d84ca8	f	\N	f	TAVERNE_AUBERGE
2022752e-1367-4834-8dae-099de55c5977	Le Radeau du Percé	Barge à trois ponts. Rhum des Profondeurs. Coffre noir sous la coque : noms de capitaines morts dont les navires accostent encore.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	\N	f	TAVERNE_AUBERGE
a5cb4ff0-5ca6-435c-b0c9-8efa963114ff	L'Auberge du Murmure	Bois sombre, verre coloré dans les murs. Poutre de noms gravés qui s'effacent à la mort. Thé aux épices de pierre.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	TAVERNE_AUBERGE
32fcbadb-fcd9-493b-bc91-da51404e1a13	Compagnie des Courtiers et Réviseurs de Change (C.C.R.C.)	Bâtiment cyclopéen, statues de marchands aveugles. QG officiel du Syndicat sous couverture. Sous-sol : autel de Zitris, balances brisées.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	AUTRE
3d7eb84a-fc88-48d3-a4c4-69a73848ad03	Cour des Murs Rouges	Placette aux fresques de dieux effacés, dont les noms ont été martelés. Puits muré vers des galeries profondes. Souvenirs minéraux.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
423c1e1d-80fa-49b5-bc4c-16e3ab7c7254	Chancellerie d'Alagir	Cœur administratif et diplomatique de la cité. Gère traités, arbitrages et alliances commerciales. 142 employés dont 24 médiateurs. Chaque traité est scellé par un vitrail miniature — tradition dont plus personne ne sait ce qu'elle scelle réellement. Siège de la Famille Palhindile.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
0b468ff9-0290-4ea3-ad7a-4c4ba4189bbf	Verreries Royales	Ateliers d'art sacré produisant les vitraux officiels, sceaux de verre diplomatiques et orbes de lumière. Conservent des moules et formules alchimiques centenaires. Le principal four, « la Gueule d'Aube », est bâti sur une faille de pouvoir.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
2053738e-f33d-498a-b29e-359a79608d13	Grand Temple de Ral & Tal Olena	Temple principal d'Alagir dans la Ville Haute. Dédié à Tal Odius (terre, cycle, justice) et Tal Olena (paix, beauté, harmonie). Mêle marbre blanc et vitraux dorés. Un chanoine siège au Conseil Restreint de la ville.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
36d4d3fa-c366-4cb4-8486-2bc72fb283bb	Les Runes de Verre	Quartier du Château de Verre, rue des Sceaux Lumineux. Façade de carreaux de verre polis changeant de couleur selon la lumière. Intérieur baigné d'un éclat bleuté, runes de protection flottant le long des murs. Spécialités : gravure de runes mineures, miroirs d'alarme, sceaux lumineux, lentilles d'espionnage (atelier discret). Clientèle : Palhindile, nobles Cilovard, mages urbains. Secret : au sous-sol, le Fragment du Vitrail Brisé peut révéler la forme véritable d'une créature polymorphe — y compris le Roi.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	MAGASIN_MAGIE
80349e8d-a048-4ded-9e45-2ed44d91915c	Palazzo Khaz'Kanoon	Siège Tovalis dans les Jardins des Âmes. Mur d'enceinte, pins, jardins, écuries. Monolithe d'onyx et bas-relief « Les Fils de la Pierre » (Arkhal le Premier). Grande salle de balle, dédale de couloirs, salle d'entraînement de Harl Denvar.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
3cce4b25-ed03-4615-9c07-009156e6c346	Salle de balle du Palazzo	Hall ~50 m, marbre blanc veiné de pourpre (kintsugi), tentures, chandeliers magiques. Balcon sur excavation illuminée vers les abîmes — vitrine du pouvoir Tovalis.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
39f35f74-b359-4703-90c3-bf89b9bc32b5	Salle d'entraînement Harl Denvar	10×10 m, marbre pourpre veiné de blanc. Râteliers d'armes, cheminée, marteau blanc veiné de pourpre. Harl y entraîne Cryta et la garde personnelle.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	de27c25a-119c-4435-a163-59bdc7240279	f	\N	f	AUTRE
59bfd806-93be-4b93-85ed-e985413ba43b	Crypte Rubis	Sous-sol lié à la Citadelle Rouge. Préparatifs d'« écailles » et matrices mentales (réunion Radius–Regalio, Partie 5).	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
0ea8ef5f-909a-4aec-ba78-472a26bb618c	Conservatoire d'Alagir	Institution artistique des Palhindile. Représentation « L'Hymne de la Flamme et du Marbre » — side quest « Les Ombres du Conservatoire » (harpe possédée).	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	a3bd30af-d091-4c93-846e-14e869ce69e5	f	\N	f	AUTRE
28bbfaf5-c052-4315-9b89-221646c69b63	Carrières Écarlates — galerie Veine Hurlante	Galerie secondaire fermée en urgence. Veine de marbre pourpre luminescent ; roche qui hurle. Fragment dormant de Tal Odius (side quest Partie 5).	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
0def10a3-503b-47b2-9ef3-45c42ef5bc28	Manoir Regalio Regani	Nobiliau dolomitcien 3e ordre. Soirée pour Marcheto Spazi ; pièce au 2e étage pour rendez-vous OP. Mesures anti-magie, combes accessibles, garde privée.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	AUTRE
c3f61c29-3710-4502-89da-263ea482fd57	Échoppe Folduin Xyrlana	Échoppe cossue Porte Pourpre. Clerc-usurier de Zitris, pourpoint or et noir, garde armée. Dette 300 Po envers Laguna Temper.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	MAGASIN
66c5d788-a8da-4096-82a8-5f7089e6a657	Demeure de Laguna Temper	Demeure gnome façonnée comme de la terre glaise (5e Roue). Laguna Temper, sorcière cristomancie 158 ans, niveau 4.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
1afe313c-9ddc-445a-a189-57a654ac067b	Domaine Mastiggia	Domaine de Gesouto Mastiggia (Porte Pourpre). Banquets, caves, commerce d'esclaves — storyline Ezbehar / Izotzargi.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	AUTRE
323a062a-bdb2-42c8-b57b-de9f968d6829	Comptoir Mastiggia — Larmes d'Ambre	Bastion commercial Mastiggia près des comptoirs de Zitris. Acte II storyline Ezbehar.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	78422bae-0fb6-4f20-935f-7c0536f9fcef	f	\N	f	MAGASIN
8e1d1ab4-e91d-4e19-b468-d8b5ec2dcabe	Le Bas-relief – “Les Fils de la Pierre”	Extrait Partie 5.md :  #### Le Bas-relief – “Les Fils de la Pierre”  Autour du monolithe d’onyx, un vaste bas-relief cerne la salle.  	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
b3cd0022-1395-4c21-8e4e-8a5252988d95	Salle de balle	Extrait Partie 5.md :  ### Salle de balle  Vous arrivez dans un immense hall d’une cinquantaine de mètres de long. Entierement blanc veiné (comme du kintsugi) de pourpre ou sont disposé 2 rangé de 6 piliers. De grande tenture pourpre son pendue au plafond à côté de 3 chandeliers gargantuesque ou brille des lumières magiques.  	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
8781872b-0799-4922-aa83-2fcbfb39e00d	Salle d’entrainement	Extrait Partie 5.md :  ### Salle d’entrainement   De 10 mètres sur 10, entierement en marbre pourpre veiné de blanc. Sur les côtés des rac d’armes en tout genre sont entreposés. Au fond, une imposante cheminée réchauffe l'atmosphère, au dessus d’elle un marteau blanc veiné (comme du kintsugi) de pourpre trone sur fond marron foncé.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
63ac8f6d-3832-46a5-b0a1-7e85ab8a39a1	La Veine Hurlante (Exploration / Mystère / Tal Odius)	Extrait Partie 5.md :  ### **🧱 1\\. La Veine Hurlante (Exploration / Mystère / Tal Odius)**  *“Sous la pierre, la montagne parle.”*  	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
f397d94e-7139-4873-aee4-4d81d6fa8197	Les Ombres du Conservatoire (Intrigue / Art / Social)	Extrait Partie 5.md :  ### **🕯️ 2\\. Les Ombres du Conservatoire (Intrigue / Art / Social)**  *“Quand la musique s’arrête, les mensonges commencent à jouer.”*  	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
19e566a4-91ad-46a3-998d-eadaacf6a719	Atelier Amiro Léovine	<p>Atelier de cristomancie d'<strong>Amiro Léovine</strong>, dans le quartier de <strong>La Cinquième Roue</strong>. La clé est détenue par <strong>Laguna Temper</strong>.</p>\n<p><strong>Accès :</strong> c'est d'ici que l'on rejoint le <strong>Laboratoire abandonné d'Amiro Léovine</strong>, le complexe souterrain en montagne. L'atelier est l'entrée ; le laboratoire est la destination.</p>	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	99a96ae0-ce96-4898-9015-4b7cfddb44b0	f	\N	f	AUTRE
10917852-538d-4ac5-9822-db917deda21c	La Fête des Poids — Comptes de Zitris (Social / Roleplay)	Extrait Partie 5.md :  ### **⚖️ 1\\. La Fête des Poids — Comptes de Zitris (Social / Roleplay)**  *“Quand tout se pèse, rien n’a plus de valeur.”*  	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
f3bdda3c-f825-4e5e-8b75-f589fd4cfa45	Palazzo Khaz’Kanoon	\n\nSalle de balle\nVous arrivez dans un immense hall d’une cinquantaine de mètres de long. Entierement blanc veiné (comme du kintsugi) de pourpre ou sont disposé 2 rangé de 6 piliers. De grande tenture pourpre son pendue au plafond à côté de 3 chandeliers gargantuesque ou brille des lumières magiques.\n De magnifiques meubles en bois foncé richement sculpté parachèvent le tableau.  Au fond, un grand balcon donne sur une ancienne excavation qui s’enfonce dans les abîmes. Tout autour de ce cône brillent des lumières qui serpentent vers les profondeurs. Lieux habillement créer pour illustrer l’étendue du Palazzo et le pouvoir des Tovalis. \n\nDédale\nDarn vous fait passer de couloir en couloir ou vous croisez une bonne dizaine de serviteurs qui vaque à leur tâches. Petit à petit vous vous enfoncez dans les étages inférieur, la décoration est moins ostentatoire que dans la salle mais elle est toujours soignée avec des peintures et de bustes en marbre, et finissez par arriver dans une pièce de taille moyenne\n\nSalle d’entrainement \n\nDe 10 mètres sur 10, entierement en marbre pourpre veiné de blanc. Sur les côtés des rac d’armes en tout genre sont entreposés. Au fond, une imposante cheminée réchauffe l'atmosphère, au dessus d’elle un marteau blanc veiné (comme du kintsugi) de pourpre trone sur fond marron foncé.\n  	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
db659a2c-6014-494e-864e-1e1b09b29e13	Laboratoire abandonné d'Amiro Léovine	<p>Ancien laboratoire d'alchimie et de cristaux, en montagne — <strong>salles I à VI</strong>. <strong>Virion Omalee</strong> / <strong>Amiro Léovine</strong>, clones cristallins, Valdris. <strong>Environnement inflammable.</strong></p>\n<p><strong>Accès :</strong> on n'y entre que par l'<strong>Atelier Amiro Léovine</strong>, dans La Cinquième Roue à Alagir — dont <strong>Laguna Temper</strong> détient la clé.</p>	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	f	\N	f	AUTRE
23641e11-f585-445d-9bac-5b3c4da603c8	Relais fortifié — Garnison de la Main du Silence	Ancien relais fortifié en pierre. ~25 membres de la Main du Silence (escorte officielle, renseignement et actions discrètes). Commandé par Kaelen Voss « Voix Silencieuse ».	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	f	\N	t	DONJON_CAVERNE
e2a6f6fd-8b5a-49cf-8404-1b854a51acbb	Hameau de Valbrume	Petit hameau agricole des plaines fertiles de Momoritanie, à quelques jours de route d'Huriya. Terres Varek, traditions rurales, juge local pour conflits mineurs.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	f	/maps/0935a865-0e93-4fcb-a5d0-e96365bd7fe8.png	f	AUTRE
7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	Monastère des Nuits	On raconte que, dans les montagnes où même les goliaths parlent à voix basse, il existe un\nlieu que l’on ne nomme qu’une fois.\nUn monastère de pierre noire, battu par les vents, dressé là où le ciel semble plus lourd\nqu’ailleurs.\nOn l’appelle le Monastère des Nuits.\nLà-bas, la magie n’est pas un don, ni une bénédiction...\nElle est une épreuve.\nHuit élèves y sont formés à la fois. Pas un de plus.\nIls ne portent pas de nom, seulement un titre, une charge...\nUne Nuit, Deux Nuit... jusqu’à la Huitième.\nChacun incarnent une école de magie, non comme un simple savoir, mais comme une\nphilosophie, un prisme à travers lequel le monde doit être compris et dominé...\nLa nécromancie est confiée à la Huitième Nuit.\nToujours.\nCar elle est l’art qui exige le plus de sang-froid...et le plus de renoncements.\nLorsque la formation s’achève, les Huitss Nuits quittent le monastère pour répandre leur\ninfluence dans le monde.\nC’est alors que le cercle se brise.	\N	\N	/Icon/place.png	\N	f	\N	t	AUTRE
fac35b8f-767d-466f-8ecf-5329226a4653	Bureau Rigart — quais du Pourpre	Petit bureau administratif de la maison Rigart, niché au-dessus des entrepôts du Pourpre. Registres de fret, contrats fluviaux, correspondance Cilovard : tout y passe sous la plume du secrétaire. L'odeur d'encre et de cire domine ; on n'y voit presque jamais Eldric — c'est Ulric Brumel qui tient la maison debout sur le papier.	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	e7bec6e6-fb32-44eb-99ff-1a5bfe748084	f	\N	f	AUTRE
57210a91-4e46-40ee-9e76-a6abd07189b1	La Loutre SAOUL	Bastion d'établissement (taverne & auberge), Bas-Quais. Niveaux 0–5 : de la ruine au joyau des quais. Trappe de contrebande, réputation, réseau d'informateurs. Table d'événements D8 (querelles, inspections, etc.).\n\nSous la coupe du Conseil d'Acier : Odon Pince « Trois-Coups » vient chaque mois réclamer la « contribution à la tranquillité » (30 po, doublée au deuxième retard).	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	cd218e67-1630-4948-a3e2-585a884aee96	f	\N	f	TAVERNE_AUBERGE
\.


--
-- Data for Name: PlayerCharacter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlayerCharacter" (id, name, class, level, race, background, alignment, "imageUrl", description, "STR", "DEX", "CON", "INT", "WIS", "CHA", pv, "pvMax", ca, initiative, speed, "isForDM", "showOnMap", "kingdomId", "cityId", "districtId", "placeId") FROM stdin;
119caa2d-452f-4136-b964-1e4208ccd37a	milo	MOINE	2	DRAKEIDE	\N	\N	\N	\N	8	16	12	10	16	10	18	18	16	3	12	f	t	\N	\N	\N	\N
7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Neuf Nuits	MAGICIEN	3	GOLIATH	Sage	\N	/maps/c44394b1-b308-4772-9498-26ae518b463f.png	Goliath mage, Niveau 3. Sage de formation, spécialiste de la magie arcanique. Résistance nécrotique. Capacité spéciale : Saut de Nuage (Cloud Giant) — téléportation 9m, 2/Long Repos.	8	12	17	20	18	15	22	22	11	1	1050	f	t	\N	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0
72c85b73-2ad5-4add-b772-b9e3bf603b3e	Illevas	CLERC	8	ELFE	Voyageur	NEUTRE_BON	\N	Clerc haut-elfe (domaine de la Vie), niveau 8 — fiche v5.5 (D&D 2024).\n\nIncantation (Sagesse) : modificateur +5 · DD des sorts 16 · attaque de sort +8. Emplacements de sorts : 4× niv 1, 3× niv 2, 3× niv 3, 2× niv 4. (Sorts préparés à renseigner — non indiqués sur la fiche.)\n\nCapacités de classe :\n— Thaumaturge : ajoute le bonus de Sagesse (+5) aux jets d'Arcanes et de Religion.\n— Calcination de mort-vivant (destruction des morts-vivants).\n— Incantation divine (conduit divin).\n\nTraits d'espèce (haut-elfe) : Vision dans le noir 18 m ; Ascendance féérique (avantage contre l'état Charmé) ; Transe (immunisé au sommeil magique ; 4 h de méditation valent un repos long).\n\nDons : Chanceux ; Résilient (Dextérité — d'où la maîtrise du jet de sauvegarde de DEX).\n\nMaîtrises : armures légères et intermédiaires, boucliers ; armes courantes ; outils de voleur. Langues : Commun, Elfique, Halfelin.\n\nBourse : 136 pc · 125 pa · 23 pe · 4472 po · 235 pp. Banque : 2000 po, 400 pp.\nDivers : perception passive 18 ; taille 1,65 m.	8	13	10	10	20	10	51	51	18	1	9	f	f	\N	\N	\N	b393fd0f-f2e5-47b9-964a-cf332114835c
67647120-404a-4ad4-84a8-716bda739c6d	Elerÿna	ENSORCELEUR	9	ELFE	Noble	NEUTRE_BON	/maps/21102073-f476-4332-98c9-45fa68393cf3.jpg	Ensorceleuse draconique (ascendance Or/Feu — résistance au feu), Elfe sylvestre, niveau 9. Fiche v5.5 (D&D 2024). Jouée par Télina.\n\nPhysique : yeux de dragon orange, peau beige clair, cheveux roux ; 1,73 m.\n\nIncantation : Charisme — DD des sorts 17, bonus d'attaque des sorts +9, modificateur d'incantation +5.\nDéfense : CA 19 = Résistance draconique 2024 (sans armure : 10 + Dex + Cha). Résistance au feu.\n\nTraits d'espèce (elfe sylvestre) : vision dans le noir 18 m ; ascendance féerique (avantage contre l'état Charmé, immunité au sommeil magique) ; transe méditative (4 h = 8 h de sommeil) ; vitesse 10,5 m.\nCapacités de classe : Sorcellerie innée (2/repos long : avantage aux attaques de sorts + DD des sorts +1) ; 9 points de sorcellerie (repos court = la moitié, repos long = la totalité) ; Métamagie ; Résistance draconique.\nDons : Doué ; Incantateur d'élite (les sorts ignorent l'abri, pas de désavantage au corps à corps, portée augmentée).\n\nLangues : Commun, Elfe, Draconique, Nain, Sylvain.\nMaîtrises d'armes : épée longue, épée courte, arbalète, dague.	10	18	10	12	12	20	46	46	19	4	10	f	t	\N	\N	\N	b393fd0f-f2e5-47b9-964a-cf332114835c
2da178f3-02a1-4383-ad8a-826c25097092	Ezbehar Izotsutzar	GUERRIER	7	DRAKEIDE	Noble	\N	/maps/4d715094-3226-4410-b969-12bb5eab1c50.jpeg	Guerrier — Soldat Psi, drakéide, niveau 7. Fiche v5.5 (D&D 2024). Historique : Noble.\n\nDéfense : CA 16 (cuirasse + Dex). PV 50. Dés de vie 7d10. Initiative +2, vitesse 9 m, Perception passive 14.\nBonus de maîtrise +3. Sauvegardes maîtrisées : Force +6, Constitution +5.\nCompétences maîtrisées : Athlétisme +6, Histoire +7, Acrobaties +5, Discrétion +5, Intuition +4, Perception +4, Persuasion +3.\n\nTraits d'espèce (drakéide) : vision nocturne 18 m ; résistance à la foudre ; souffle draconique ; vol cristallin (10 minutes) ; esprit psionique.\nDons : Doué ; Affinité ombreuse ; Respiration aquatique.\nOutils : échecs draconiques.\nLangues : Commun, Draconique, Primordial, Orc, Géant.\n\nArmes : Épée longue aux reflets sous-marins +1 — attaque +7, 1d8+4, maîtrise Sape. Cimeterre « Tranchant de l'esprit brisé » +2 — attaque +8, 1d6+5, Coup double.\nObjets magiques liés : épée longue aux reflets sous-marins, tranchant de l'esprit brisé, masque d'ombre du corbeau.\n\nIncantation (don Affinité ombreuse) : Intelligence — DD des sorts 15, bonus d'attaque des sorts +7. Sorts : Invisibilité, Blessure.\n\nBourse : 246 po, 82 pa. En banque : 2 600 po.\nCopropriétaire de La Loutre SAOUL (acte de propriété) et détenteur de parts de la Compagnie des Trois Moustiquaires.	16	14	14	18	12	10	50	50	16	2	9	f	t	\N	\N	\N	b393fd0f-f2e5-47b9-964a-cf332114835c
\.


--
-- Data for Name: PlayerCharacterEquipmentItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlayerCharacterEquipmentItem" (id, "playerCharacterId", name, quantity, description, equipped) FROM stdin;
eed197b5-e2a3-494e-9847-61d287be7206	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Anneau de protection mentale (Ring of Mind Shielding)	1	Objet magique attunés — immunité à la détection/lecture de pensées	t
2efcfe19-762e-49b5-9671-69215acd8fcb	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Dague	2	\N	t
f281bb05-ebc8-4346-ad91-fb839af9f50a	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Bâton de marche (Quarterstaff)	2	\N	f
233b9dcb-5468-46c0-8a94-19908be939bd	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Grimoire (Spellbook)	1	\N	t
28993b21-c916-447f-a8c2-6b4d2bf76eda	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Parchemin	18	\N	f
f50b4e49-286c-47fb-b582-0db6e56f85c2	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Sac à dos	1	\N	t
7862ae78-57c4-436c-8a86-3c0ff9a1b5b6	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Matériel de calligraphie	1	\N	f
ef85cfbf-aea6-4e41-99f6-a61b7551fdc4	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Robe	2	\N	f
d9e73744-688e-4a1d-91d2-d9c056bde6e4	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Livre	2	\N	f
327e740f-1126-4e25-8ad1-ee3e64a0ed42	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Lampe	1	\N	f
50929ba6-d1c8-4b29-b5a5-d93c9dbd12d4	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Plume & Encre	1	\N	f
3414e4e4-1f07-40aa-b369-1ea93576ef49	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Huile	10	\N	f
6f0acf70-2581-40a7-a8f7-aa19da07f74d	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Boîte à amadou	1	\N	f
6bdebf46-62d8-413a-96a8-c205b750e76b	67647120-404a-4ad4-84a8-716bda739c6d	Arbalette	1	Att +6 | 1d8 dégâts perforants	t
631aaad2-b3f2-4344-8bcb-d8f592ae04fe	67647120-404a-4ad4-84a8-716bda739c6d	Dague	2	Att +5 | 1d4 dégâts perforants | Légère, Finesse, Lancer	t
267beacf-8e99-4748-893f-ee4265f04ccc	67647120-404a-4ad4-84a8-716bda739c6d	Sacoche à composantes	1	\N	t
5c68d94b-f012-4ecc-aa29-0832b9eca4af	67647120-404a-4ad4-84a8-716bda739c6d	Focaliseur arcanique	1	\N	t
e834f7d6-0fae-47b4-b3fc-00166b71716c	67647120-404a-4ad4-84a8-716bda739c6d	Paquetage explorateur	1	\N	f
454eba2b-8ab4-40be-b686-2a2dc09ab690	67647120-404a-4ad4-84a8-716bda739c6d	Fiole anti-poison	1	Antidote — neutralise un poison	f
ced1afd2-31f9-4179-a050-e250a1da2f37	67647120-404a-4ad4-84a8-716bda739c6d	Corde	1	15m	f
8fdfefd6-ec6a-42bf-a85f-f9d23f05af03	67647120-404a-4ad4-84a8-716bda739c6d	Craie polente	1	\N	f
2823cdf1-7c6b-4dd4-b9ab-982fc8c5c177	67647120-404a-4ad4-84a8-716bda739c6d	Clé pourpre	1	Objet de quête	f
0d267635-46b4-4837-96f4-11a23ff8a9c3	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Armure d’écailles miroitantes	1	CA de base 15 ; avantage aux jets de sauvegarde de Constitution.	t
e552cf69-a6e2-4f70-8b70-ab46635c4969	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Bouclier	1	+2 CA	t
fa887aff-d52a-475f-9c26-342a5327cb60	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Masse d’arme	1	+2 à l’attaque, 1d6 dégâts	t
2c7b20c6-ab82-4064-9f52-494bb7fe7b7f	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Symbole sacré	1	Focaliseur d’incantation divine.	t
bd0de2d6-19c5-4627-a9b1-31e55da344fc	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Outils de voleur	1	Maîtrise.	f
03b7a54c-4440-4501-a25c-41537d705725	67647120-404a-4ad4-84a8-716bda739c6d	Écaille canonique	1	Objet de quête	f
5cfa5fdf-ae9d-4592-8164-86b0b20e5f82	67647120-404a-4ad4-84a8-716bda739c6d	Pendentif Doigt	1	Bijou — objet magique potentiel	t
461a3be9-4826-4074-9091-e33bd719797e	67647120-404a-4ad4-84a8-716bda739c6d	Laisser-passer momoritanien	1	Document officiel	f
5baedea2-b8c1-4a72-8fd1-9c7144032475	67647120-404a-4ad4-84a8-716bda739c6d	Vêtements fins	1	\N	t
9b224b91-9c52-4dd8-a95a-5584df787a05	67647120-404a-4ad4-84a8-716bda739c6d	Chevalière	1	Bague à cachet	t
206e26b6-ff39-438c-88d3-221aa9b0efb5	67647120-404a-4ad4-84a8-716bda739c6d	Lettre de noblesse	1	Document	f
a076818a-0628-4848-95df-8dbf9edf8968	2da178f3-02a1-4383-ad8a-826c25097092	Cuirasse	1	CA 14 + Dex (max +2) = 16	t
3f14a34d-2069-4119-8be4-7eef0aa6a716	2da178f3-02a1-4383-ad8a-826c25097092	Masque d'ombre du corbeau	1	Objet magique lié.	t
3cfa5bde-e50d-40b1-a38d-02787bc3fca7	2da178f3-02a1-4383-ad8a-826c25097092	Potion de soins	2	4d4+4 PV	f
be8422a2-0059-4a24-901c-72ae653c0991	2da178f3-02a1-4383-ad8a-826c25097092	Acte de propriété de La Loutre SAOUL	1	\N	f
40dd6d52-e9e1-40cd-b270-64a8ed5f7d6a	2da178f3-02a1-4383-ad8a-826c25097092	Parts de la Compagnie des Trois Moustiquaires	1	Lecture incertaine sur la fiche papier — à confirmer.	f
425cf82d-0b55-4f13-8b32-72335b15944d	2da178f3-02a1-4383-ad8a-826c25097092	Passeports de Loretta	4	\N	f
ceccdfbe-f4a2-4678-b1e9-c410e7ec7b49	2da178f3-02a1-4383-ad8a-826c25097092	Livres en draconique	10	Lecture incertaine sur la fiche papier — à confirmer.	f
d5fa17e0-f174-4ac4-be56-58832900fcb7	2da178f3-02a1-4383-ad8a-826c25097092	Livre de religion	1	\N	f
8551f53d-76fd-4f9e-ac15-206d5942f300	2da178f3-02a1-4383-ad8a-826c25097092	Costume de bal en velours	1	\N	f
a5da38b6-0044-4086-9acc-7a9521b58b70	2da178f3-02a1-4383-ad8a-826c25097092	Épée longue aux reflets sous-marins +1	1	Attaque +7, 1d8+4, maîtrise Sape. Objet magique lié.	t
1c54db29-0a27-44b2-90c0-9aaff591f531	2da178f3-02a1-4383-ad8a-826c25097092	Cimeterre « Tranchant de l'esprit brisé » +2	1	Attaque +8, 1d6+5, Coup double. Objet magique lié.	t
\.


--
-- Data for Name: PlayerCharacterSavingThrow; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlayerCharacterSavingThrow" (id, "playerCharacterId", ability, proficient) FROM stdin;
f7afdc9f-4dce-4aca-bf1d-ec450245d689	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	STR	f
cb60ee9a-977c-4e5c-a03e-c5a839b40c56	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	DEX	f
e18c027b-dcd2-4b80-82c3-ab943689745e	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	CON	f
b2e797fb-1168-4c63-894d-e1089854e5ae	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	INT	t
1cd3eb4c-cbb4-4798-a179-bfd86a7b7714	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	WIS	t
0ea96e5a-ea8a-4cd2-99b4-2add1f2d9385	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	CHA	f
fc7d5890-214c-4f32-af8d-7cd7df9237b0	67647120-404a-4ad4-84a8-716bda739c6d	STR	f
ea689bc6-988c-415e-817c-6696aed39cc7	67647120-404a-4ad4-84a8-716bda739c6d	DEX	f
72d3303f-1fd6-47fd-88cb-75687321d95e	67647120-404a-4ad4-84a8-716bda739c6d	CON	t
af38ae0b-89b2-461f-b863-302694006ed3	67647120-404a-4ad4-84a8-716bda739c6d	INT	f
1eac0df4-f2a5-4472-87ba-d9fa4cc37a7d	67647120-404a-4ad4-84a8-716bda739c6d	WIS	f
ae0c79b2-8e81-4b8f-be57-ee58b818390d	67647120-404a-4ad4-84a8-716bda739c6d	CHA	t
63ce1ce5-0e15-45a0-a025-9ce78eca6112	2da178f3-02a1-4383-ad8a-826c25097092	STR	t
a2d1cbce-78be-4972-ba96-7672535fe215	2da178f3-02a1-4383-ad8a-826c25097092	DEX	f
2c64f3c0-769c-428d-bf5d-68ef911317bd	2da178f3-02a1-4383-ad8a-826c25097092	CON	t
4cd2c3a7-24ac-4b96-8f36-cd4360d4ad54	2da178f3-02a1-4383-ad8a-826c25097092	INT	f
6d68e362-12f9-49df-9ea5-5a9a2f851ee1	2da178f3-02a1-4383-ad8a-826c25097092	WIS	f
9868e667-8eb4-4855-8b22-c37f62c86803	2da178f3-02a1-4383-ad8a-826c25097092	CHA	f
192f175e-f2aa-44bd-ae23-32e654c5efa7	72c85b73-2ad5-4add-b772-b9e3bf603b3e	STR	f
079b8465-1137-4164-885a-4ef4113aa041	72c85b73-2ad5-4add-b772-b9e3bf603b3e	DEX	t
08a6577f-d5b7-4046-944b-7a897658170b	72c85b73-2ad5-4add-b772-b9e3bf603b3e	CON	f
574e5180-481d-433a-9e7d-35973b598a88	72c85b73-2ad5-4add-b772-b9e3bf603b3e	INT	f
ec2468ab-c3df-42de-b497-b417d29cf4f5	72c85b73-2ad5-4add-b772-b9e3bf603b3e	WIS	t
b49b5f67-8c0b-4150-a070-e72aea0efb76	72c85b73-2ad5-4add-b772-b9e3bf603b3e	CHA	t
ec40a637-428a-4c6a-b8b3-7a7e54629dcb	119caa2d-452f-4136-b964-1e4208ccd37a	STR	f
ba86e068-5e00-4829-9d30-33f98983250b	119caa2d-452f-4136-b964-1e4208ccd37a	DEX	f
dabf4372-91ec-4874-a893-3586f64dc74e	119caa2d-452f-4136-b964-1e4208ccd37a	CON	f
e1569296-2431-445a-ac96-91d1ef4b7e79	119caa2d-452f-4136-b964-1e4208ccd37a	INT	f
9c3de574-b057-4c2c-a396-2df66876e976	119caa2d-452f-4136-b964-1e4208ccd37a	WIS	f
019f6faf-cf19-4eba-b7a0-318b020b21df	119caa2d-452f-4136-b964-1e4208ccd37a	CHA	f
\.


--
-- Data for Name: PlayerCharacterSkill; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlayerCharacterSkill" (id, "playerCharacterId", name, proficient, expertise, ability) FROM stdin;
17736db9-c35e-434d-ad0f-74430069a86e	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Acrobaties	f	f	DEX
70519de6-1688-433b-abb8-ab485a659d03	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Arcanes	f	f	INT
590e9ae9-24f0-4945-848e-e4ff9a7a520d	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Athlétisme	f	f	STR
f6eeab14-8884-47fb-992c-8504609d864e	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Discrétion	t	f	DEX
4357a787-17ed-40ed-b645-619ab5f811b7	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Dressage	f	f	WIS
349a92bb-d478-4c1e-a4c8-a5c29d3c0f58	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Escamotage	f	f	DEX
af1ce31b-9e8c-4808-a0d0-5e10e54d6ccc	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Histoire	f	f	INT
ce8df08a-af53-4139-a46c-46a7f9ac7aac	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Intimidation	f	f	CHA
f6406017-7dd2-42a6-bb6c-e033dbac8a73	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Intuition	t	f	WIS
e16ba042-d450-4f84-a9fc-70c0a312ea35	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Investigation	f	f	INT
311a090c-ce90-4342-81d2-bfa026ccf0aa	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Médecine	t	f	WIS
bfb07a4e-7717-4292-8041-ec11daa5fa66	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Nature	f	f	INT
34e468c9-fbd9-4a5c-af20-4ad03cfcf676	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Perception	t	f	WIS
8b672505-d8ce-4b67-9e11-595c201f0854	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Performance	f	f	CHA
6113ec6b-7fda-4dc7-b79c-18d847b0cc5e	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Persuasion	t	f	CHA
c1e00cb2-2ad6-42d3-9f87-94b97f7c5ee4	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Religion	f	f	INT
66613e38-69cb-4d93-9dca-e613a0493eb1	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Survie	f	f	WIS
ad8fed9d-4d11-4a24-a843-7411fd92c9d4	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Acrobaties	f	f	DEX
405fb8b3-af53-4c10-9678-130965ec4b07	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Arcanes	t	f	INT
351f7e91-2131-440b-8d3f-8983103cfe60	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Athlétisme	f	f	STR
d4e3b7f5-9b15-4bf7-abec-a117706fa732	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Discrétion	f	f	DEX
90c591ff-7315-4aa3-98e5-7b796c8afdeb	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Dressage	f	f	WIS
ed169462-6291-4465-8363-8ee8f58a099c	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Escamotage	f	f	DEX
430bb2d9-f713-47d4-992f-bad8bba88eaa	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Histoire	f	f	INT
64505b0a-c3ee-4912-a68e-d02e0d7b376c	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Intimidation	f	f	CHA
df42ae75-d7a2-462e-8a09-f65c21f96d3f	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Investigation	f	f	INT
8619e75d-281f-4910-b6d3-b75dab639ea8	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Médecine	t	t	WIS
6c02f0a7-cac4-4e9c-b81c-42d56459d6f0	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Nature	f	f	INT
9557774a-3947-4de8-94f4-46c3bcea8831	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Perception	f	f	WIS
83af37de-17ca-4c4c-ae25-5a5b88e32816	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Performance	f	f	CHA
edf1674d-b3af-4031-bb84-cd256392b05b	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Persuasion	f	f	CHA
67ed0ef2-1d06-42bb-be85-73acf4b82db6	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Religion	t	f	INT
d5a6d9d3-5293-4922-9469-5214e827ac78	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Survie	f	f	WIS
48aaf990-b320-49c7-b7f7-ef221166f50a	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Tromperie	f	f	CHA
743538d6-dec7-45ad-836e-e3047b4365f6	2da178f3-02a1-4383-ad8a-826c25097092	Acrobaties	t	f	DEX
480df2ea-28ea-4f91-b9a0-ca9d1441b83a	2da178f3-02a1-4383-ad8a-826c25097092	Arcanes	f	f	INT
08266bff-e016-43d6-85fa-baa084370f26	2da178f3-02a1-4383-ad8a-826c25097092	Athlétisme	t	f	STR
f66548a4-bf12-4f7d-902f-09659a8ecfa8	2da178f3-02a1-4383-ad8a-826c25097092	Discrétion	t	f	DEX
e658a2d0-ed99-425e-aad8-22a93ebe07c8	2da178f3-02a1-4383-ad8a-826c25097092	Dressage	f	f	WIS
a8ca9335-90a9-4f02-99e4-13c438265c6e	2da178f3-02a1-4383-ad8a-826c25097092	Escamotage	f	f	DEX
e9cb0ae9-893f-4c3e-a0ff-7294af19ca86	2da178f3-02a1-4383-ad8a-826c25097092	Histoire	t	f	INT
246f9323-a2f1-48f7-a2cc-0e899769b955	2da178f3-02a1-4383-ad8a-826c25097092	Intimidation	f	f	CHA
687912e8-0713-46ed-b2bb-c5e64c43b1f9	2da178f3-02a1-4383-ad8a-826c25097092	Intuition	t	f	WIS
60b3111a-0f5f-4e3a-b15b-6ffa2704fdbe	2da178f3-02a1-4383-ad8a-826c25097092	Investigation	f	f	INT
685b7705-1c43-4d9c-91e8-b0980adda7fc	72c85b73-2ad5-4add-b772-b9e3bf603b3e	Tromperie	f	f	CHA
331ac5cb-ad05-4084-a89c-750469ef865c	2da178f3-02a1-4383-ad8a-826c25097092	Médecine	f	f	WIS
51393c2b-9ee2-45a3-9c75-a5e0a6872623	2da178f3-02a1-4383-ad8a-826c25097092	Nature	f	f	INT
61cfe197-e2b4-4d90-a037-6db04aabd0da	2da178f3-02a1-4383-ad8a-826c25097092	Perception	t	f	WIS
2b8d567b-a7ed-46a2-973f-4a06161f7020	2da178f3-02a1-4383-ad8a-826c25097092	Performance	f	f	CHA
07a35c10-0292-43db-9bc3-18dd6405cb61	2da178f3-02a1-4383-ad8a-826c25097092	Persuasion	t	f	CHA
b6185f87-93d5-47de-8384-947c255b62d8	2da178f3-02a1-4383-ad8a-826c25097092	Religion	f	f	INT
f5c51ec2-4bb4-426c-9500-01cfba2e8ec4	2da178f3-02a1-4383-ad8a-826c25097092	Survie	f	f	WIS
2c509759-7bf1-4234-b7d3-b23f04c557d3	2da178f3-02a1-4383-ad8a-826c25097092	Tromperie	f	f	CHA
05d84a0c-e227-430f-8b5d-9518e09d0935	119caa2d-452f-4136-b964-1e4208ccd37a	Acrobaties	f	f	DEX
99d4e206-9b5f-4e49-84d3-cdc7a79764dc	119caa2d-452f-4136-b964-1e4208ccd37a	Arcanes	f	f	INT
0bec9a67-b9ad-4000-a8eb-007c9204226f	119caa2d-452f-4136-b964-1e4208ccd37a	Athlétisme	f	f	STR
06d1fe02-63e2-4258-b751-179e23f0b871	119caa2d-452f-4136-b964-1e4208ccd37a	Discrétion	f	f	DEX
65615944-7c60-4ffd-9c4e-61b74c37fda4	119caa2d-452f-4136-b964-1e4208ccd37a	Dressage	f	f	WIS
6e479aeb-66d4-4961-b1d5-0824d0de79f7	119caa2d-452f-4136-b964-1e4208ccd37a	Escamotage	f	f	DEX
e789b920-11e7-49d8-a3d7-08107c12bd53	119caa2d-452f-4136-b964-1e4208ccd37a	Histoire	f	f	INT
b436d981-505f-406f-9085-a39f9e4cba46	119caa2d-452f-4136-b964-1e4208ccd37a	Intimidation	f	f	CHA
b29e5a80-1c77-424e-8fb8-5876b297199a	119caa2d-452f-4136-b964-1e4208ccd37a	Intuition	f	f	WIS
ff5130fe-958e-49af-a299-43fba729f39c	119caa2d-452f-4136-b964-1e4208ccd37a	Investigation	f	f	INT
b272ae15-e315-4bb2-b3dc-b65067a14e88	119caa2d-452f-4136-b964-1e4208ccd37a	Médecine	f	f	WIS
1decdab6-44d2-4e85-a7ce-242765c9c1dc	119caa2d-452f-4136-b964-1e4208ccd37a	Nature	f	f	INT
0cb9eb09-642e-4000-93d7-a3f0633d6a90	119caa2d-452f-4136-b964-1e4208ccd37a	Perception	f	f	WIS
a583b626-f288-4ae2-8312-3ca47cfb24b7	119caa2d-452f-4136-b964-1e4208ccd37a	Performance	f	f	CHA
f84b0115-d81f-42b8-8549-8b681c69925d	119caa2d-452f-4136-b964-1e4208ccd37a	Persuasion	f	f	CHA
6177e548-ef16-4cd7-85ea-a3d5effa4509	119caa2d-452f-4136-b964-1e4208ccd37a	Religion	f	f	INT
e41726f7-17f5-4b83-8a3d-fa43b42f47b2	119caa2d-452f-4136-b964-1e4208ccd37a	Survie	f	f	WIS
7a55780e-a8f1-4383-bade-75bf2e2b098a	119caa2d-452f-4136-b964-1e4208ccd37a	Tromperie	f	f	CHA
ceb00ca2-5d1f-42f1-93d1-6d0378e75616	67647120-404a-4ad4-84a8-716bda739c6d	Acrobaties	f	f	DEX
7a51be66-5568-44c2-86d2-2388ec24b79d	67647120-404a-4ad4-84a8-716bda739c6d	Arcanes	t	f	INT
466cdaf7-a3ad-4826-897f-28644fc2ddbe	67647120-404a-4ad4-84a8-716bda739c6d	Athlétisme	f	f	STR
a16350c5-b0ec-446a-a0ff-70413e71f88a	67647120-404a-4ad4-84a8-716bda739c6d	Discrétion	t	f	DEX
d4ccee4a-9865-48ce-947d-2c058faabf2a	67647120-404a-4ad4-84a8-716bda739c6d	Dressage	f	f	WIS
0a6273b0-e3f7-47fc-82a1-08496fbcd40a	67647120-404a-4ad4-84a8-716bda739c6d	Escamotage	f	f	DEX
6399b667-5b2d-4bc1-bea0-be197a05918f	67647120-404a-4ad4-84a8-716bda739c6d	Histoire	t	f	INT
f38bab8c-1ae9-4671-b717-844903a46438	67647120-404a-4ad4-84a8-716bda739c6d	Intimidation	f	f	CHA
82c43f56-54ae-45ff-a936-48d85200ba06	67647120-404a-4ad4-84a8-716bda739c6d	Intuition	t	f	WIS
0ef7ffd9-3740-4d52-9207-f4d56f9dd7b6	67647120-404a-4ad4-84a8-716bda739c6d	Investigation	t	f	INT
4c0b8ccf-f547-4d27-90b4-ea5134f0b74b	67647120-404a-4ad4-84a8-716bda739c6d	Médecine	f	f	WIS
20f4e483-8796-45f7-b1ab-18cbc8fd9c42	67647120-404a-4ad4-84a8-716bda739c6d	Nature	f	f	INT
216c466a-87fa-443c-a7fc-62f4a6602928	67647120-404a-4ad4-84a8-716bda739c6d	Perception	t	f	WIS
bb78ac14-016a-44bd-84e8-f1e3cfea5b0a	67647120-404a-4ad4-84a8-716bda739c6d	Performance	f	f	CHA
d4fe2054-e931-4e95-8b36-5cf0a45bc72c	67647120-404a-4ad4-84a8-716bda739c6d	Persuasion	t	f	CHA
48c270e3-c5dd-4a55-97cb-e96d2b357e1e	67647120-404a-4ad4-84a8-716bda739c6d	Religion	f	f	INT
8b3dd975-e0bf-4c94-aadc-7d9b82446e13	67647120-404a-4ad4-84a8-716bda739c6d	Survie	t	f	WIS
70669ac4-7d1e-4724-9a3a-2472adde1bce	67647120-404a-4ad4-84a8-716bda739c6d	Tromperie	f	f	CHA
\.


--
-- Data for Name: PlayerCharacterSpell; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlayerCharacterSpell" (id, "playerCharacterId", name, level, school, description, prepared) FROM stdin;
3103c66d-6e39-4ca7-b512-f6e6e5190f66	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Trait de feu (Fire Bolt)	0	Évocation	+7 | 120ft | V,S | Instantané — 1d10 feu	t
58465e43-ca48-4678-bb3a-5b6dde915ec5	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Main du mage (Mage Hand)	0	Invocation	30ft | V,S | 1 min — main spectrale	t
5f282915-d10f-4e0b-a5fc-4f163542de01	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Illusion mineure (Minor Illusion)	0	Illusion	30ft | S,M | 1 min — son ou image statique	t
2dc268d7-f1a6-4548-88b2-4048e3b3de0b	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Rayon de givre (Ray of Frost)	0	Évocation	+7 | 60ft | V,S | Instantané — 1d8 froid, vit -10ft	t
0552c0b3-5adf-452e-8d3a-be24eb31ae34	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Choc des éclairs (Shocking Grasp)	0	Évocation	+7 | Contact | V,S | Instantané — 1d8 foudre	t
1f88e226-8584-4757-8cbb-c596fe6636ab	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Alarme (Alarm) [R]	1	Abjuration	1A+ | 30ft | V,S,M | 8h — alarme magique	f
e1fa7321-07b7-4768-a260-566b87336f07	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Compréhension des langues [R]	1	Divination	1A+ | Soi | V,S,M | 1h — comprend toutes les langues	f
be9683ce-5eef-454a-8ffc-49c69380b83e	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Charme-personne	1	Enchantement	WIS DC 15 | 30ft | V,S | 1h	t
b1323b0d-66dc-497e-a3d8-414029f7b7b7	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Orbe chromatique	1	Évocation	+7 | 90ft | V,S,M | Instantané — 3d8 au choix	t
fb1eb09b-2eb6-42c8-9920-b227f6872aa4	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Trouver un familier [R]	1	Invocation	1h | 10ft | V,S,M | Instantané	f
d60dfc47-04c3-430f-b9f0-1de255ca47d7	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Rayon affaiblissant	1	Nécromancie	+7 | 60ft | V,S | Instantané — 2d6 nécro	t
d7df035f-bfa1-466e-8386-dfbe2d2722c4	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Détection de la magie [R]	1	Divination	1A+ | Soi | V,S | Conc. 10min, Sphère 30ft	f
9e27c65e-bd86-4a68-b223-297bb800504a	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Déguisement	1	Illusion	1A | Soi | V,S | 1h — change apparence	t
fa9b1090-cc53-48de-9dfa-54bb7bfe077b	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Armure de mage	1	Abjuration	1A | Contact | V,S,M | 8h — CA 13+DEX (Magic Initiate)	t
066eb899-f73d-4d3d-ae0a-c599d969186e	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Repos doux (Gentle Repose) [R]	2	Nécromancie	1A+ | Contact | V,S,M | 10 jours	f
f6128c90-f847-4ee8-a6c3-d8dfefb6fd8b	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Lévitation	2	Transmutation	CON DC 15 | 60ft | V,S,M | Conc. 10min	t
c6b02037-e00d-4e01-a41c-7280b65285e2	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Invisibilité	2	Illusion	1A | Contact | V,S,M | Conc. 1h — cible invisible	t
a2031a2d-1db0-4a07-a035-7fb44913ddc0	7d71bc29-ee85-415a-b2b3-3ad9dcb83706	Rayon affaiblissant (Enfeeblement)	2	Nécromancie	CON DC 15 | 60ft | V,S | Conc. 1min	t
7529adf2-f047-4554-8088-af914acfbab4	67647120-404a-4ad4-84a8-716bda739c6d	Mur de feu	4	\N	\N	t
9bbffd03-f0bf-4a86-8697-52b520f46e4b	67647120-404a-4ad4-84a8-716bda739c6d	Charme-monstre	4	\N	\N	t
7f1f1bea-8005-4daf-8ee2-8fa88b07b7ae	67647120-404a-4ad4-84a8-716bda739c6d	Bouclier de feu	4	\N	\N	t
ab6f2143-e086-47c1-ac4f-8de58bc9147c	67647120-404a-4ad4-84a8-716bda739c6d	Télékinésie	5	\N	\N	t
5c84a6d3-e9f0-451f-b308-83bb4409e560	67647120-404a-4ad4-84a8-716bda739c6d	Convocation de dragon	5	\N	\N	t
423617ce-0cc2-4deb-bde6-2054a613abe6	67647120-404a-4ad4-84a8-716bda739c6d	Contrôle des flammes	0	\N	\N	t
2a3a3c9c-bc79-466d-a1a1-d97326eefcf9	67647120-404a-4ad4-84a8-716bda739c6d	Frappe foudroyante	0	\N	\N	t
4362ab17-bb7c-46b5-b6ad-4af8c432069e	67647120-404a-4ad4-84a8-716bda739c6d	Main du mage	0	\N	\N	t
b3bd028f-222b-45c6-a1d4-17de4544ba73	67647120-404a-4ad4-84a8-716bda739c6d	Message	0	\N	\N	t
de8a7fa5-1abc-4f1c-8724-e2f868670939	67647120-404a-4ad4-84a8-716bda739c6d	Trait de feu	0	\N	\N	t
6d6989c4-3eca-48db-854d-85af03e51cb1	67647120-404a-4ad4-84a8-716bda739c6d	Bouclier	1	\N	\N	t
6692cc1f-4be1-423c-9f68-73e9f20e5942	67647120-404a-4ad4-84a8-716bda739c6d	Projectile magique	1	\N	\N	t
d46b25b9-0ede-4f9d-ae5b-60d6b56085e3	67647120-404a-4ad4-84a8-716bda739c6d	Injonction	1	\N	\N	t
d5886823-021b-4a1a-9e7b-6ccc40b922ba	67647120-404a-4ad4-84a8-716bda739c6d	Grande foulée	1	\N	\N	t
d2b93295-3d17-4e69-9591-c68b14b22443	67647120-404a-4ad4-84a8-716bda739c6d	Rayon ardent	2	\N	\N	t
1e37dfe4-340d-4895-aa7f-1b76527244bc	67647120-404a-4ad4-84a8-716bda739c6d	Sphère de feu	2	\N	\N	t
2da7a13c-b70d-4bcf-9562-2b05f0c6d194	67647120-404a-4ad4-84a8-716bda739c6d	Souffle du dragon	2	\N	\N	t
55012a04-b18c-40d6-995a-9068eb6a00b8	67647120-404a-4ad4-84a8-716bda739c6d	Passage sans trace	2	\N	\N	t
65ac4fdf-68b8-4bf2-a433-5e5c61b32de9	67647120-404a-4ad4-84a8-716bda739c6d	Boule de feu	3	\N	\N	t
113007f2-3f20-43e2-845a-57125b99850b	67647120-404a-4ad4-84a8-716bda739c6d	Contresort	3	\N	\N	t
27471b59-6e43-4320-8c84-8f772c13feee	67647120-404a-4ad4-84a8-716bda739c6d	Peur	3	\N	\N	t
0f2d5bca-378b-4983-92a0-05fd504c0337	2da178f3-02a1-4383-ad8a-826c25097092	Invisibilité	2	Illusion	Accordé par le don « Affinité ombreuse » — incantation à l'Intelligence (DD 15, attaque +7).	t
160bd9a5-3a77-4429-aa50-46b9414a9135	2da178f3-02a1-4383-ad8a-826c25097092	Blessure	1	Nécromancie	Accordé par le don « Affinité ombreuse » — incantation à l'Intelligence (DD 15, attaque +7).	t
\.


--
-- Data for Name: Position; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Position" (id, x, y, "kingdomId", "cityId", "placeId", "personOfInterestId", "playerCharacterId") FROM stdin;
c36a3ad8-aff6-4829-a4d2-7946d31b9a2b	0.448551724137931	0.8113425925925926	\N	ec01895d-64a4-4687-8f2d-035f149904ed	\N	\N	\N
c5430d76-e94e-41d1-bcc2-4b9a5a828dcc	0.4108965517241379	0.8666666666666667	\N	94a2fd1d-9a42-4b60-ba6e-865208b430c1	\N	\N	\N
ae75863c-031d-4978-b363-ab3869290463	0.7183448275862069	0.4578703703703704	\N	b220665e-2800-44ce-84e0-b0f9313640ed	\N	\N	\N
db0876f3-04c5-41fe-bbfe-2fcbf3871b15	0.3122758620689655	0.4416666666666667	\N	157a72f3-cc46-4430-8e4f-9ab0fefcf133	\N	\N	\N
30f509a9-5b53-4e28-a998-90acacf976fe	0.4431724137931035	0.9243055555555556	\N	9c44080d-9577-4c58-9a2f-4b8111c491d2	\N	\N	\N
afd00cc6-3a2f-4633-8219-4449dba1d986	0.4231724137931034	0.7944444444444444	\N	bdb2dcea-441e-4a99-9f75-200d554d88f6	\N	\N	\N
8e54ad1f-c9c7-4794-a374-83e67c11f44f	0.3853793103448276	0.9474537037037037	\N	e270ac1d-4df4-4af9-bb2c-ed96865d3b12	\N	\N	\N
9908eaae-78b7-4f02-aa06-1b03c3efb2ea	0.3310344827586207	0.9002314814814815	\N	d5c6a0ac-1cb8-47cb-b0fc-aa17fefc587e	\N	\N	\N
163e0ea4-cec0-4e98-8faa-2317a99dbf8a	0.3987586206896552	0.7613425925925926	\N	5d0cc51f-c6ac-4036-ad03-7344efecb965	\N	\N	\N
4f63ae08-7f22-4074-8c5c-dbeab6813b59	0.5075862068965518	0.7638888888888888	\N	4de27113-8487-455c-ab37-d740d69d5619	\N	\N	\N
84019ca9-e1c9-4668-8b37-3ac05edcdce9	0.3668965517241379	0.7261574074074074	\N	2580fe9d-e8a1-46f1-83c1-d33b26ed6863	\N	\N	\N
09a2d22e-2567-4886-8af8-82b2b85f3908	0.7936551724137931	0.4412037037037037	\N	b35688a0-96ed-4416-82b9-19db566f7815	\N	\N	\N
3c3dbf96-d1f9-42b8-97dd-d7465b30fc93	0.4797241379310345	0.7418981481481481	\N	2859a2c9-8ccc-4de5-a74e-4b8be15bb838	\N	\N	\N
232267da-6927-4b9b-bf4d-eefda5d00d96	0.2168275862068965	0.8768518518518519	\N	3777dab0-1e36-491c-859a-fdc48062201b	\N	\N	\N
3a15007b-6fb4-4100-b1d7-ff5c9dda4a4f	0.3337931034482758	0.6217592592592592	\N	b508926d-83a0-4372-92d7-2363aeade1f4	\N	\N	\N
ae802ffe-9b9b-49f5-b5e4-d2ed21613011	0.2784827586206897	0.8619212962962963	\N	752d5094-7102-4a38-926a-cb814de89e27	\N	\N	\N
f7e6214f-1c1b-4085-be20-a88cf9fabd9a	0.2424827586206897	0.7344907407407407	\N	6c33f828-7b6b-4890-95ce-0822caa1e807	\N	\N	\N
a00caefd-8e1b-4a67-bf1c-da75f353ddad	0.4281379310344828	0.7196759259259259	\N	19e896ae-0b41-46ed-923f-825f43215b53	\N	\N	\N
08f06166-475b-4985-95fd-29fde1415d07	0.1462068965517241	0.7087962962962963	\N	f4722f65-bb3e-400d-b818-260db1011f3a	\N	\N	\N
7610e332-0ecf-498e-9e14-a58ae1a19030	0.32	0.7340277777777777	\N	c136e1cc-0f84-4729-b3e2-8dee3e6d46e1	\N	\N	\N
6666bb19-4443-492b-8f9f-2db1d718f097	0.6670344827586207	0.4046296296296296	\N	c1e27b23-4188-4fdd-96df-9d9dba88833b	\N	\N	\N
81310f03-4cc4-4a45-bd17-1ad196165f1c	0.4667586206896552	0.8930555555555556	\N	b6d0fb34-df10-41f9-ab7a-585402919c03	\N	\N	\N
5a8bbd53-acac-4ee1-8361-f6d512df76fa	0.4579310344827586	0.8666666666666667	\N	da0f5b30-743d-422a-b281-9d276681f56f	\N	\N	\N
7c10e3e6-aa41-478a-a8d1-88e4f9f8aebd	0.8684137931034482	0.6822916666666666	\N	7f0198e3-b293-4d8c-a7ed-0bd1b9120e17	\N	\N	\N
36c6fd69-5226-46f2-af6b-c26c44944419	0.4772413793103448	0.8240740740740741	\N	19df6e53-8868-4511-8a58-39c9e3659c21	\N	\N	\N
04b850ec-be4f-44fe-89cd-f93d53db4084	0.1713103448275862	0.3533564814814815	\N	e46962cc-2d61-423b-b3b8-e7466ffcd976	\N	\N	\N
49b00d1a-5338-4e83-89d1-fb3046fac8f4	0.3542068965517242	0.675	\N	bb93ab0c-8f81-430e-ac0b-16800b113e0e	\N	\N	\N
196df31f-c103-4e46-96b2-dd680510e9f8	0.3382068965517241	0.8275462962962963	\N	181d1980-2ade-4c0d-bf44-4252e636dc6c	\N	\N	\N
db84f3bc-5262-4741-9b74-b82b797d9e7e	0.263448275862069	0.5604166666666667	\N	295580b8-9df6-4209-9d2a-1d237144a69c	\N	\N	\N
9ae59802-16d8-4ed6-a03e-02b754b1871a	0.1702068965517241	0.507175925925926	\N	96745fc0-6d7e-421c-a0a8-3bbb12b8f4c9	\N	\N	\N
1f0bf2eb-9ccd-4454-9201-5f5e70018aa1	0.4057931034482758	0.3460648148148148	\N	ce3fb962-bb73-47f4-8e12-656c0af3f4a1	\N	\N	\N
933cfc0f-f396-409e-b1e6-89573e876e17	0.512551724137931	0.4611111111111111	\N	47119f73-bd40-4a59-b1c4-b8daf1b0eade	\N	\N	\N
2f172cb1-ddcb-441d-8e0a-e37d509cb404	0.2266206896551724	0.2872685185185185	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N	\N
2565403b-fad8-46de-80bd-61ae88007cfe	0.745448275862069	0.203125	\N	cfda6692-0df6-400e-b9df-6786da0f1d92	\N	\N	\N
1c156fd8-2ac4-478d-b0b5-f9e206d65f9e	0.577103448275862	0.3598379629629629	\N	6b642f1f-70b8-4b37-ba14-9e3922efe3a8	\N	\N	\N
b65abcae-c919-45e7-bcd2-b0a340be9bd6	0.4583448275862069	0.1431712962962963	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	\N	\N
da1c12f8-2106-4ad5-b4b3-b241fb2ac0ce	0.4758620689655172	0.3893518518518518	\N	a602cacc-0d51-4334-a9e9-b54a7d60ac24	\N	\N	\N
e0a9a3ec-02df-4d41-9ddd-3a11b549d1f5	0.8339310344827586	0.3060185185185185	\N	d11ea82c-fc71-44f1-8d14-5ae423a31f83	\N	\N	\N
167e3d3c-8c79-4dd3-a6cd-a8a1ae45cb40	0.7624827586206897	0.3148148148148148	\N	ac1ff1a0-087e-4400-8ce6-91337e238d24	\N	\N	\N
1f1e6a0c-60e3-4d5d-9491-e144bb674b0a	0.7873103448275862	0.3947916666666667	\N	3c5962f4-339b-433a-b253-135a32db63f1	\N	\N	\N
d2b06a26-e9cf-499e-9a4b-b68906424917	0.8557241379310345	0.6322916666666667	\N	0ff4ed2b-4048-4ce9-9ec3-1c617727895c	\N	\N	\N
2fdf935e-0db6-406c-b51b-7d9ab0f9a7b7	0.6819310344827586	0.3199074074074074	\N	1ab001f3-e7d0-4cb2-a0ff-c6800549dc8d	\N	\N	\N
d19da760-a091-454b-ab57-d98f772f806a	0.7335172413793103	0.3648148148148148	\N	aef53759-d6b9-4bca-bc2b-7aca5ffb2676	\N	\N	\N
0682bb70-25ce-46be-9628-b093358903e4	0.634896551724138	0.349537037037037	\N	f410d0e6-ae0b-47b9-92d0-a91e1a0e65a0	\N	\N	\N
327c97e1-e0a5-44b5-8049-2ebccc71181c	0.6510344827586206	0.2490740740740741	\N	42220881-20fd-4bc5-a818-d00cd79473b7	\N	\N	\N
053d7be3-8040-400b-afe8-feffd93293ad	0.7536551724137931	0.53125	\N	7c205d43-f91b-46f1-8809-7e774090823f	\N	\N	\N
78820537-38ca-4571-ae7f-16471c63b042	0.3975172413793103	0.2523148148148148	\N	72589e8c-bbbe-43fe-bb68-c7be7fbe0347	\N	\N	\N
63388216-6448-4f36-8572-9470e2258c11	0.353103448275862	0.1902777777777778	\N	bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	\N	\N	\N
2c7b051a-69c3-44b2-afd2-9ac38b0b1481	0.2146206896551724	0.2018518518518519	\N	443543db-314f-472e-a899-3d42f34fdb5f	\N	\N	\N
dad65cb7-8c3a-4fb3-8983-0da6b76aad82	0.5106206896551724	0.1988425925925926	\N	fd428152-24ae-4cf5-8239-ad928df9f930	\N	\N	\N
1f16356e-abff-43c8-a441-00dad051ba4b	0.2819310344827586	0.6368055555555555	\N	899e1c2a-a99b-4eef-8e00-5657476b4a27	\N	\N	\N
935e1465-d979-4c82-bad5-ef373fa02be5	0.5135862068965518	0.3028935185185185	\N	d52e5905-28b3-427a-b3ed-82a0d5646a9c	\N	\N	\N
745c25d4-d3e7-4027-b91e-5cc53bfa86fe	0.2141379310344828	0.6281828703703703	\N	7ccf7b24-0e5e-42e5-8493-76ee231c25ac	\N	\N	\N
65c5edc4-e816-4626-940c-0c8f29c730ee	0.7062068965517241	0.8388888888888889	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	\N	\N	\N	\N
e107a1bc-ff67-47d8-b35a-8335e9808553	0.3251379310344827	0.293287037037037	\N	42044469-437c-43d5-b1e3-41c4c6b18035	\N	\N	\N
7c27c736-7e96-445d-b488-ce7e33ede435	0.495448275862069	0.004629629629629629	cbf00301-c56a-4702-92b7-c5fa6013f99a	\N	\N	\N	\N
2677259d-1928-48a5-b127-dfdc1a3b971a	-0.03310344827586207	0.5962962962962963	44383b5f-5ed4-4ae8-91ac-2c377928206e	\N	\N	\N	\N
c6449d08-2650-43bb-95ad-19b2dd05eee8	0.1743448275862069	0.9833333333333333	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	\N	\N	\N	\N
6d98cdb4-81cb-47c9-8cb8-a2d2476c79fb	0.3920862068965517	0.2918113425925926	\N	8d5a0617-0e82-4a8a-855f-582c1003805f	\N	\N	\N
9adfeea4-355b-4fc5-807d-a781d529e90b	0.2980689655172414	0.3836805555555556	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N	\N
20bb159b-238d-453e-a80b-81373422e978	0.9908965517241379	0.3324074074074074	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	\N	\N	\N	\N
0747fc64-5be5-44ad-b6b0-9c5239ed20ae	0.1725431034482759	0.2588179976851852	\N	ce4ce8b9-77fd-4105-a0fb-ee5edb557a7c	\N	\N	\N
fd3d1db5-52bd-4220-9cde-0901c265b358	0.2098620689655172	0.4278356481481482	\N	3cd0ba8b-db9c-4cbe-83e9-49a515399cbb	\N	\N	\N
7c1b2560-5421-482b-9031-ff7349abea26	-0.008827586206896552	0.1962962962962963	4d37eed1-161e-4156-970c-381793c3d614	\N	\N	\N	\N
248a1d74-c87f-435e-a810-5b91c8bcfd5b	0.3155862068965517	0.5236111111111111	\N	\N	\N	a50188f9-724b-4ba6-b62b-0a1a0f43bf97	\N
60fcc154-6a23-452c-8418-3c3e396eb930	0.4918620689655173	0.6366898148148148	\N	4f2eca99-0e4a-4039-a211-9509758b8de3	\N	\N	\N
105103fd-d764-4fec-b673-f75a51b26662	0.3155862068965517	0.5231481481481481	\N	\N	\N	3ffea450-a1d7-4505-8008-5fd47e93abb5	\N
27057312-3ac9-4476-aaf3-eea12d93b717	0.4847222222222222	0.4133333333333333	\N	\N	\N	88682d84-12ec-48fa-8ede-98a13e027b9f	\N
4f6e2727-661f-4fe9-91ab-24d91e199f63	0.4941944847605225	0.2708333333333334	\N	\N	\N	7decf0c5-b84f-4a4b-b666-c9d820a104dc	\N
c34eb45e-adf3-4d76-a250-b0b83711fb57	0.5094339622641509	0.2608333333333334	\N	\N	\N	d45b4ef2-160c-4676-bdf4-cefd20ae05b3	\N
878c6a74-3da2-4cbd-be98-c9c152a1f3e7	0.5776487663280117	0.1808333333333333	\N	\N	\N	7411def3-6e81-4808-96ef-b66596714505	\N
ea7e7111-3324-43cd-98fe-e33530348829	0.5674891146589259	0.1808333333333333	\N	\N	\N	5e8db395-6054-40e6-bd92-ef809166fa15	\N
1ed5a5d3-0a6a-40ad-bb85-0fc4216333c3	0.5667634252539913	0.1758333333333333	\N	\N	\N	ac73eee3-4844-4da5-acb9-9b01d92162a7	\N
4ca9c94a-fa3b-445f-b4d1-d6561019f805	0.5653120464441219	0.1708333333333333	\N	\N	\N	38e8071e-b2f2-4f88-ac70-4e3e80fd6f7d	\N
e4e74407-cd96-4d61-bbd0-826a33b71204	0.4642758620689655	0.5560185185185185	\N	fce0576a-07d3-436d-a1be-2f7ea9ad34f2	\N	\N	\N
ebdbcdf5-faf3-4f9c-830b-dc7ee325acd2	0.5412413793103448	0.5456018518518518	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N	\N
98b30bf2-387a-4b58-910b-a83a3fc4b8fb	0.4783448275862069	0.6944444444444444	\N	388f3dfc-a23b-4cb4-8a38-4f15e36cdca6	\N	\N	\N
ecd7e7e2-639f-4a39-96c0-2471622466dd	0.3710344827586207	0.675	\N	7e2bddb2-6fc1-4d3e-8f50-95a6d241f012	\N	\N	\N
5ef71402-6ec7-4685-9e62-3e5e72bd3df4	0.3369655172413793	0.5927662037037037	\N	2c8c2982-7dfa-4be4-96e9-328c05473197	\N	\N	\N
d2d32195-df3c-4d1a-a722-8e625a3eba48	0.6874482758620689	0.6138888888888889	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	\N	\N	\N
ca8ff777-6d37-4834-b9c6-093b9dd30c08	0.2718824921610659	0.3655450038299018	\N	\N	555b341a-0b2c-4983-8c51-186d9adde148	\N	\N
ddb46591-adba-4dcd-a326-3523bc23c8ee	0.2949125901886904	0.3475207193296769	\N	\N	8051841f-52e4-4d8d-91d6-ff4af5ed3070	\N	\N
5a8ad896-622c-4edc-921b-959dd260b5e1	0.3186723022341054	0.4185762066234496	\N	\N	\N	e13c1d51-c23d-470d-a222-38bd035041c0	\N
a37c1a20-b759-4d65-8909-25bf253ffff6	0.2804633368367871	0.4219120158933175	\N	\N	\N	d0556534-e9cd-4984-9336-2bfc2d65330d	\N
e1452431-39d6-49de-b6a9-8d12d0e92fa7	0.2534939533890908	0.3919466132269731	\N	\N	\N	3a3880bc-3274-4229-a6e5-08dc14789e11	\N
5145dbd3-48a3-4008-ab36-ae73d9092866	0.2615168925253362	0.3505319090363719	\N	\N	\N	8ef5bbf7-606e-4c5d-a427-57698e1072f8	\N
eeed126c-2ff1-4e1b-8b07-beb0a7db9469	0.3010003916881105	0.331169308694192	\N	\N	\N	656809e7-16fc-4426-bea1-e959b3b3ca61	\N
17626aab-aee3-41c8-bba4-75b7589e8de3	0.3418030394142638	0.3517446173666896	\N	\N	\N	3619cf19-1247-487a-90e9-809a5f7151cc	\N
e70c6112-4a46-4c9e-a04f-dd9816524bc8	0.3503354565063475	0.398325342473403	\N	\N	\N	f05886e6-dc07-490e-bef6-cfadddc95564	\N
0a5eaf74-f89a-457c-907e-fb88d447aa43	0.3172842538548018	0.4344441797110921	\N	\N	\N	df59f6a7-ad3b-4e8c-b767-2e58b4bdade9	\N
bf5380ee-9de1-40a0-b3af-bb04ff9813a7	0.2669881096549442	0.4297909420267082	\N	\N	\N	1d1e4325-7323-4b8f-a73c-28a416d31803	\N
2bbd02c6-2768-4ac3-b9ce-3ace1d439eba	0.2394987757494522	0.3856309274250221	\N	\N	\N	57723973-8294-4642-ac88-6890c04984a7	\N
d91a0579-65ea-4577-9d17-17b673ce1a03	0.2585768836274126	0.3356687124852321	\N	\N	\N	4168e798-427a-474b-bb0c-cd5b07258f43	\N
0d72721f-0356-46eb-a1ec-09d70615efc1	0.3112733922954062	0.3202508246779826	\N	\N	\N	7f674dac-162b-4243-8e77-7362d636a241	\N
014348ec-f5f4-45bf-a88e-843447b78809	0.2379577185974412	0.5081554328965248	\N	\N	\N	316845f4-28fa-4cec-bd97-0c0454f4e300	\N
73b49b04-d627-433a-a075-36bf531eb2fa	0.2830777212299698	0.4535024365354276	\N	\N	\N	09d82ceb-5d5a-4b96-bb8b-c600fd01ee72	\N
9490867c-3a1b-433b-a1ab-95786d24e62d	0.3549738691944501	0.456365963240064	\N	\N	\N	dfc47ef6-1540-4d8a-b08e-73085ee56b36	\N
0526a17f-e3d8-4f52-8a88-12a10e475090	0.3968370169784876	0.5161925922991589	\N	\N	\N	c1debe50-c816-4db1-9cb1-8395109675a9	\N
ad7eea04-9ec9-44d3-aff6-f88d6fb6e295	0.368	0.4854166666666667	\N	f64aae8f-c25e-446d-b281-cc1c0fff707e	\N	\N	\N
a4deecef-b374-4711-9311-17f5da21a19b	0.3743448275862069	0.5412037037037037	\N	3c456778-4811-4c35-8504-6af9803f8c5e	\N	\N	\N
34898832-8f48-48da-a987-9c938a5cdbd0	0.2987586206896552	0.3815972222222222	\N	\N	06749d5e-ec84-4015-a156-ab1ad1b3a7a4	\N	\N
51f9db06-68ab-48de-b3b0-e2bb5daaf8d0	0.2987586206896552	0.3815972222222222	\N	\N	e445a4a2-d1e3-4547-8dd7-4c9faf3e7463	\N	\N
2b10f4d5-d5dc-4519-92e0-187f9d4d984f	0.2987586206896552	0.3815972222222222	\N	\N	b3b0f2aa-5124-4985-bf1f-d07bf3097628	\N	\N
ad398556-20cf-4e57-96b7-ad2a66c62bd6	0.2987586206896552	0.3815972222222222	\N	\N	0b468ff9-0290-4ea3-ad7a-4c4ba4189bbf	\N	\N
253353ba-334d-4abf-b2cd-098e20a2bb66	0.5131034482758621	0.4995370370370371	\N	264a9f82-fdc3-4667-bd60-439a2a89ab04	\N	\N	\N
f31ab810-4aca-463b-a715-a537830a1faa	0.2471724137931035	0.3759259259259259	\N	\N	b393fd0f-f2e5-47b9-964a-cf332114835c	\N	\N
cb104704-ea76-49f1-8b33-7071c029edc4	0.2987586206896552	0.3815972222222222	\N	\N	756ac544-47ef-4c00-9236-6fe3efd3792e	\N	\N
c1f3d85b-2edd-4246-9bb2-9c37adf620e1	0.3376551724137931	0.4303240740740741	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N	\N
bcef500b-19f3-43df-b027-1f2b8a397b28	0.4253793103448276	0.4574074074074074	\N	e2d54173-58fe-4417-b763-e90fca60fd31	\N	\N	\N
0e726a63-6854-4620-aa7e-46cc83b77ff3	0.2987586206896552	0.3815972222222222	\N	\N	c7279c93-060a-4b73-906a-4353b2ce1f15	\N	\N
89f0ccd1-0571-478b-8565-462db3df5697	0.2987586206896552	0.3815972222222222	\N	\N	2053738e-f33d-498a-b29e-359a79608d13	\N	\N
e69a8afe-07b7-496d-bf13-dcbdb3954df7	0.2987586206896552	0.3815972222222222	\N	\N	ad9221dc-540b-401c-a972-ba2b61c8ebe3	\N	\N
dee98668-2ccf-41f3-b300-876735f09506	0.2987586206896552	0.3815972222222222	\N	\N	fd8ed968-cfd3-4d8b-a06f-f65097ae8f5b	\N	\N
88a045a6-fc5c-4f40-a896-9c4800d4f634	0.2987586206896552	0.3815972222222222	\N	\N	56908e36-4174-48be-8397-0d49c9ce0c69	\N	\N
29d26d52-f8d9-4e97-a51a-825d07272201	0.2987586206896552	0.3815972222222222	\N	\N	9ffe2919-51a4-4ec3-92a2-4af55fa1355f	\N	\N
fbee7dad-f4f5-442f-a2f8-a1bc06d4878a	0.2987586206896552	0.3815972222222222	\N	\N	ac5fdf5d-4195-42a7-8a86-9d8c964336e1	\N	\N
7e790f71-8b9a-41e4-914a-f9647de4264c	0.2987586206896552	0.3815972222222222	\N	\N	199430ce-4977-47bb-9bf8-9a5eb922adad	\N	\N
c269b178-8be7-422a-a9e0-4585b1f0e361	0.2987586206896552	0.3815972222222222	\N	\N	b9e6dc77-25ec-44f4-84e6-c34623e647c9	\N	\N
6332dc24-9911-4443-b5a3-8febdbfbf8d5	0.2987586206896552	0.3815972222222222	\N	\N	f5b539bf-f8fe-40ec-be80-fae92e62bfeb	\N	\N
e32c292a-79b0-4711-8a9f-fdbe87053d1c	0.2987586206896552	0.3815972222222222	\N	\N	28977457-6c67-47c0-a9eb-385fbe0d15c1	\N	\N
7e2f424b-cb52-4b13-9b43-77b48af60b58	0.2987586206896552	0.3815972222222222	\N	\N	4001bd74-56fb-4909-82dc-1eef5feeac39	\N	\N
48fecc32-0a4f-4a2d-9abf-ced5eb24435d	0.2987586206896552	0.3815972222222222	\N	\N	c79aa2b9-2f0a-4aca-a7a2-e8f3a301c6d7	\N	\N
b08c089c-2823-4483-95bf-b0ddd869f5f3	0.2987586206896552	0.3815972222222222	\N	\N	0424792b-e344-42cd-988c-146b68038dfb	\N	\N
a4118fb9-1c31-416f-8064-b2263aa2a698	0.3759310344827586	0.4935185185185185	\N	\N	\N	608b70c9-bf82-4fcb-8d6a-b64cf7b78683	\N
b6090bba-720d-4c9c-be52-3d152fb6fb8d	0.3739256616291371	0.5092706269367386	\N	\N	\N	7b2ec74b-dd52-4532-b35a-ce8a967f84aa	\N
7881f5ed-e675-4b4a-9f58-80d80ae4acff	0.355481753245301	0.5168938638960777	\N	\N	\N	cd665704-3386-4cca-b611-7c7d76a65876	\N
876a58d2-e290-413b-a3de-96718cb8c163	0.3359449985968973	0.5039456916224201	\N	\N	\N	53ab6d68-6d6d-4d29-af36-0982564af74d	\N
fa2c2a14-bebc-4464-8aba-864478c80887	0.3350549059541693	0.4774663001261982	\N	\N	\N	84d45a45-0b27-44e8-bbae-7746c82fd96e	\N
330d4533-51f4-4fa4-bb0f-6bd608e2ea4a	0.3580850039817938	0.4594420156259732	\N	\N	\N	efa72d8b-f525-4adf-9f29-497eb2301563	\N
57993e79-80b9-4b23-ab02-1e76a24ca547	0.5392516507703595	0.3291666666666667	\N	\N	\N	f0974caa-af4e-47c0-b94b-9fdaeb629ec0	\N
99bcdcc9-3cd0-44dd-a8ee-b2e98927c1ca	0.3170176330674208	0.4769881744349328	\N	\N	65b1535b-b040-4e90-bc3f-25734e675ae1	\N	\N
5d8d64fa-8b0b-4da6-9c95-5ad20723255b	0.374251462673694	0.586734322366111	\N	\N	\N	80cd77ba-2ea6-4f4e-9e3f-3acb57577fa2	\N
ad5b2f08-0e2d-4940-af1a-6556857df2f2	0.3578202807935741	0.4975634831074303	\N	\N	648113c1-93ea-4f74-8786-318fed58f4c8	\N	\N
289a952f-49ca-4032-9b18-01f74f23d3b7	0.3034597281752611	0.6118195542051721	\N	\N	\N	253a5d7d-a2de-46ab-ae40-366e5ab5543a	\N
1159e3b2-9582-4dfb-a7f1-a4a1158fcc28	0.3663526978856578	0.5441442082141437	\N	\N	d280b9fb-1b1b-4bcd-9aa0-eaa43700a4fb	\N	\N
788af7e8-c009-47eb-a641-de0ca1e2e636	0.2397753575542323	0.5701118058107223	\N	\N	\N	2f92433f-2dcb-4066-b792-27f69e99c84f	\N
1eb84f8d-422c-4b35-9f3a-d1566fe8b133	0.3333014952341121	0.5802630454518328	\N	\N	df3fc552-d2a7-4722-b627-367b28740fe5	\N	\N
12a2a6c9-dd76-4e4e-8612-d83acad7d9de	0.234332236635096	0.4931695826367942	\N	\N	\N	103d4388-fc71-4dad-9b99-186119f693cd	\N
df7d5c00-e421-469f-9d29-31d2390a86e8	0.2830053510342545	0.575609807767449	\N	\N	0c4d671e-5e18-48f2-b75f-d4e4402a9433	\N	\N
30cabfe5-7283-4ef1-ba12-08c6fe9aac10	0.293014326521956	0.4415881462968816	\N	\N	\N	616401be-fdef-45c9-bf7d-81a7039544f5	\N
65001e6f-92bb-41a1-b936-e1c66ac719f3	0.3705616487325775	0.4572452535207107	\N	\N	\N	ad6c6045-a171-4de7-9126-f8be53be760f	\N
495cfbe1-5003-41df-ae03-65b5419c46a8	0.2555160171287625	0.5314497931657628	\N	\N	3224c898-95b2-4737-b460-969d81c1e5bc	\N	\N
441f1065-d4b7-48a7-9b14-35527127392b	0.4054864390511853	0.5293111403508373	\N	\N	\N	6339c956-1d05-46f3-a430-a84c27f68b7d	\N
20d2ef55-8900-43be-8dfe-c470a78cadf9	0.3688549773069699	0.6016013243316276	\N	\N	\N	3b825d8b-5ddf-4e9f-8f6b-6e649330ee05	\N
00456f65-3a39-4e4d-b5d7-33703382e421	0.2745941250067229	0.4814875782259728	\N	\N	de47dbe3-1415-4c22-9559-cb0b280e584c	\N	\N
60060085-9cbe-4041-a653-d0893275e940	0.2882125957388231	0.6164014400265128	\N	\N	\N	ef114e09-ba22-4700-9948-3472f61558f0	\N
68cedd30-235d-490d-bc0a-fdb463d22224	0.3153793103448276	0.5277488425925926	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N	\N
ee6f1944-8224-4c5c-8bac-c41fae4dd3c6	0.2987586206896552	0.3815972222222222	\N	\N	36d4d3fa-c366-4cb4-8486-2bc72fb283bb	\N	\N
6ae0e460-05b6-41f3-bc4d-2a7f9a3a8d8c	0.2987586206896552	0.3815972222222222	\N	\N	\N	abc00e5f-0814-4aa4-abae-3c7c81b136aa	\N
41c4a8af-1a4f-4e25-af55-29139791c144	0.2987586206896552	0.3815972222222222	\N	\N	442b74a9-f192-4061-be65-0229e70889e9	\N	\N
0ce05b2a-88fd-43f0-b261-e8664ff5bd02	0.2987586206896552	0.3815972222222222	\N	\N	\N	0ab73b36-d4bf-4d6d-9f91-79dcdb07fd05	\N
49a045ef-023f-4a04-84f5-275a77071175	0.2987586206896552	0.3815972222222222	\N	\N	e61af0df-fecc-48a5-993b-d8f36ef79021	\N	\N
edcb17f0-4894-4c11-b27a-816c39be5054	0.2987586206896552	0.3815972222222222	\N	\N	\N	41bd801c-d53a-4ec3-9aed-c4032372297a	\N
3939441b-5129-427e-a9bc-9f0da624701d	0.2987586206896552	0.3815972222222222	\N	\N	8507526b-0c7e-4d3a-bd95-8f4d47c1f8d7	\N	\N
19c21c58-330e-4d55-9352-5bf7de366451	0.2987586206896552	0.3815972222222222	\N	\N	\N	70268214-1ad4-4d19-a123-cb1cf268ac1c	\N
3e39428d-a42a-4bcd-a984-e555d8077245	0.2987586206896552	0.3815972222222222	\N	\N	145ee62b-6bcb-49d2-b728-15f421f7782e	\N	\N
dcbe3496-c0c6-4302-a8a0-08afeefe7843	0.2987586206896552	0.3815972222222222	\N	\N	\N	c904f8e1-61ae-4a23-9417-3d3af47a22ab	\N
04de01fd-fdd2-4210-9482-1d103d9af188	0.2987586206896552	0.3815972222222222	\N	\N	d32f0ae0-88a5-418b-b70f-6e3d56a633e0	\N	\N
c1d8e905-3b07-4223-9ddc-b26021f47527	0.2987586206896552	0.3815972222222222	\N	\N	32fcbadb-fcd9-493b-bc91-da51404e1a13	\N	\N
8a2ab09b-1669-4ccb-b312-ee23253faa77	0.2987586206896552	0.3815972222222222	\N	\N	418977aa-45be-435b-9efe-ab69fed14ac0	\N	\N
84e8e99a-b849-4910-a017-bbaa634e4f4b	0.2987586206896552	0.3815972222222222	\N	\N	3d7eb84a-fc88-48d3-a4c4-69a73848ad03	\N	\N
2ed46cbd-1861-40e1-8774-12579d3aae36	0.2987586206896552	0.3815972222222222	\N	\N	233d4e8f-b373-4a1d-88f0-b3fbb74d2329	\N	\N
7862b905-a1b3-4190-809a-df6668607349	0.2987586206896552	0.3815972222222222	\N	\N	c9077e67-1cef-4fc0-9395-5cd1e5aaa7eb	\N	\N
4f8699c8-2446-4b63-b95b-4897f1093b08	0.2987586206896552	0.3815972222222222	\N	\N	8f6fe71d-a75c-4235-96da-9b4c65bebe0b	\N	\N
7a35434a-40a1-4c81-b4ad-fe57036e6793	0.2987586206896552	0.3815972222222222	\N	\N	2587a572-d2c8-48ff-8f4b-37e2d8c4f9a6	\N	\N
0c08ca53-dc83-4b87-830e-1da172344def	0.2987586206896552	0.3815972222222222	\N	\N	1ec106e1-0f0e-4f06-a410-b12f08c2196a	\N	\N
a4248e80-51e6-49b5-aa84-797f51081632	0.3127586206896552	0.3815972222222222	\N	\N	90973c2b-35d8-4c57-ac8d-0a8ea86170a5	\N	\N
b2fc5f02-4ce4-466a-8990-4447c86f4bad	0.3107532478360337	0.3973493306404423	\N	\N	12c4b86b-580f-49f4-881a-7ba593cf175f	\N	\N
a2a5d2e6-9f91-4adc-9fe0-f8890d216517	0.2923093394521976	0.4049725675997814	\N	\N	0a7bd954-949d-479c-9d26-522c76b65a49	\N	\N
d8ea8cab-9668-4460-a84f-bf0988db999b	0.2727725848037938	0.3920243953261238	\N	\N	b15522c5-a603-424e-aa13-55a7e5de4785	\N	\N
49d34046-ecf4-4bdc-ad12-7c086bc3b65a	0.3287758620689655	0.5274160879629629	\N	\N	c529b485-e20b-41a9-9954-3058397c3c7d	\N	\N
0a57b5f2-b63e-4cce-85bb-579649d1eec2	0.326770489215344	0.543168196381183	\N	\N	aa0614c7-e0d3-4e0e-be3f-36c291d510ab	\N	\N
62b8ed3c-7724-488b-84c7-09ee29db9deb	0.2887898261831042	0.5378432610668644	\N	\N	a125f5fb-f383-4013-9124-5b045718d5d9	\N	\N
19986f82-6727-4b15-aa54-3078c5578a47	0.08462068965517242	0.2666666666666667	\N	\N	3a9e4197-db86-419a-9143-ff5cb489213d	\N	\N
2d7a23cb-a7d4-4aac-bfb6-2404d38ee95c	0.2406206896551724	0.2872685185185185	\N	\N	961fbde9-43d6-4db5-ab3e-88b6632cdb5c	\N	\N
0486ca0e-d4b2-4004-bf83-a4e61b8f8001	0.2386153168015509	0.3030206269367386	\N	\N	d20173dc-ba36-4e9d-bcfe-f14c0538f9fb	\N	\N
74715ea5-1757-4427-94c8-6574a969a40c	0.4723448275862069	0.1431712962962963	\N	\N	58242ace-5dbd-444d-8692-e0dfb8bf032b	\N	\N
cd387962-c725-4a43-b083-ee71538ce20e	0.4371724137931034	0.4578703703703704	\N	\N	441573b4-db5c-4d34-a78f-91b0a71bbb8f	\N	\N
044e1154-df18-43e1-ba69-2c92257823e1	0.4351670409394819	0.4736224787885905	\N	\N	f0c920a5-6ac0-4547-80f5-5a36778cd1a2	\N	\N
3ecf0ae6-0121-4c1d-b74a-5b44d4a6eaff	0.4167231325556458	0.4812457157479296	\N	\N	594bcec6-5c3b-43a2-98b5-1a2a590bb085	\N	\N
382353df-9943-473a-acf6-0e12fe8122e2	0.3971863779072421	0.468297543474272	\N	\N	20a26041-31b1-415a-901d-65bf212fa430	\N	\N
624e2688-88e4-4ab4-9186-7060584562ad	0.2987586206896552	0.3815972222222222	\N	\N	87c3e055-157a-4dab-b802-05e9219f7327	\N	\N
3e5f04b4-a310-400e-842b-3b1a12cb938f	0.2987586206896552	0.3815972222222222	\N	\N	57210a91-4e46-40ee-9e76-a6abd07189b1	\N	\N
83dac3bc-cd4a-4279-a44d-7336b053f9a7	0.2718824921610659	0.3655450038299018	\N	\N	\N	60ee9017-2f5a-45c6-90ae-e7f253db2093	\N
6ed96723-decb-487f-877d-a130d182960f	0.2949125901886904	0.3475207193296769	\N	\N	\N	dc878db9-301f-4fbc-b3bb-63298432df54	\N
d47dbc46-c518-4115-9772-f2b67e116194	0.3255255034912071	0.3559938243014776	\N	\N	\N	d1e9e544-2b9c-453b-b111-190c32add1cb	\N
8af67ca7-b143-40f6-9711-d4c102fcda3c	0.3378707233906649	0.3877813488627165	\N	\N	\N	216d16e4-dc88-45be-95bf-aa4469195ae3	\N
3138f120-c91a-4765-8890-4bc32952556d	0.3186723022341054	0.4185762066234496	\N	\N	\N	53f2f592-f1a7-4a7a-8e69-94f1f7e10392	\N
71d5da14-17bb-4fe0-8427-fae8e98385cd	0.2804633368367871	0.4219120158933175	\N	\N	\N	93239b41-8dee-4147-bc01-c5f2bdfd4614	\N
5ec70862-6da3-459b-a916-720c1b667969	0.2534939533890908	0.3919466132269731	\N	\N	\N	7633faa3-0a05-46c2-84ef-2af359ecddbd	\N
6afb7e19-75d4-43b2-9300-df25ed9c413b	0.2878997335403762	0.5113638695706426	\N	\N	\N	0635e083-b406-40d7-993a-a29761a51e98	\N
64509292-5341-4f4b-a608-04d0c1dd25bb	0.3109298315680007	0.4933395850704176	\N	\N	\N	8c168c38-e7b9-41c2-8c19-31ab1291a61b	\N
4f197119-09bf-452e-9bbd-b6cd7a59c8ff	0.3415427448705174	0.5018126900422183	\N	\N	\N	fa898d26-72c6-4fa4-958d-5769659f0c96	\N
1dfd5b30-50f4-440a-b3c1-bfa26964f5c7	0.3538879647699752	0.5336002146034573	\N	\N	\N	daf4f14e-23a8-43a4-a8d5-6b8b15f4f5e3	\N
8d7e6d7f-25e3-4fe4-86f1-15a7aee04877	0.3346895436134157	0.5643950723641904	\N	\N	\N	3404bc03-fafd-4973-a52a-7abe5cc45f7b	\N
4f216d5c-a273-43a4-8e6f-c050b79118b9	0.2964805782160974	0.5677308816340582	\N	\N	\N	b4ed8705-c606-4d5c-b2b2-20a02d7f68dd	\N
8d440a42-49c8-41c6-a4ec-2a0fb788f04f	0.2695111947684011	0.5377654789677138	\N	\N	\N	88e30e84-b07b-4b8f-97fe-42f1ab21bd65	\N
b485c384-c4e2-4d10-90f0-b8b18a6a983b	0.2775341339046465	0.4963507747771125	\N	\N	\N	305f7912-1425-49b9-9529-3101b7649577	\N
da6c3102-4943-45e2-a4b3-e42d8d4e7312	0.3170176330674208	0.4769881744349328	\N	\N	\N	50f56fba-bd43-49b3-950c-826bb22de8da	\N
be0aaba2-2e4b-4c7d-b675-deaa210793e5	0.3578202807935741	0.4975634831074303	\N	\N	\N	a769c06b-ef2d-4987-ad34-80758bd81651	\N
50de0ca2-4832-4e5a-a67e-2411bbc1520e	0.3663526978856578	0.5441442082141437	\N	\N	\N	149293d0-6af3-42ff-9d20-d61ee6cb087b	\N
6c2c5bda-9e55-4ca2-86d0-8fb6d4b2c6d8	0.3333014952341121	0.5802630454518328	\N	\N	\N	0e7884ef-39e4-426c-ada4-4851a847be10	\N
d3b87455-bd42-4c6d-a4c0-dcd40fc760c8	0.2830053510342545	0.575609807767449	\N	\N	\N	c6f893d7-0646-4172-80dd-4798e47130d5	\N
676107c3-6974-4879-a34e-b69fd261e523	0.2555160171287625	0.5314497931657628	\N	\N	\N	c986e6da-4b07-417f-a5f0-dbdf3e34d2e0	\N
e42c4b07-f7b1-467d-97b0-c9f8aebd3c56	0.2201714084177148	0.3106438638960777	\N	\N	\N	dd2598e4-5d11-4837-9fd6-1b98611f49e8	\N
6b15978d-a477-45ea-8032-9e9ae263db93	0.2006346537693111	0.29769569162242	\N	\N	\N	581d24ff-5df3-4e16-b585-b932895bb945	\N
1ba0a969-03d8-4594-9cd3-c37cf85a8f04	0.1997445611265831	0.2712163001261981	\N	\N	\N	bdb9e983-b145-4aa7-a0e8-0606cc53c055	\N
6de93e1f-24a5-4f08-8387-88a3a52ccba0	0.2227746591542076	0.2531920156259732	\N	\N	\N	460b4174-26c0-4c0a-b713-05eda1781183	\N
15eb84b1-8083-44b3-986a-b6688c6a6ac7	0.2533875724567243	0.2616651205977739	\N	\N	\N	08f2a4b8-c936-43e7-8123-408a146f0ab7	\N
15e8851b-00a5-4c3e-8a13-3b779539743d	0.2657327923561821	0.2934526451590128	\N	\N	\N	9ea769c9-d2cf-42f1-a789-34b0d95a4784	\N
99ed61dd-7720-46b1-87cd-5e1ba9bed5dd	0.2465343711996226	0.3242475029197459	\N	\N	\N	8dcd2a3d-5b74-4afb-a4c8-febb777dc3a4	\N
c314babe-d902-4c43-b37c-dd02418824e1	0.2083254058023043	0.3275833121896138	\N	\N	\N	1e5f2c01-aa70-44bf-b9b9-6feed04701ac	\N
e4a5d361-88ca-41f7-918f-d9b58f7c52ae	0.181356022354608	0.2976179095232693	\N	\N	\N	306e438b-31a2-4faa-9e4a-30408185897e	\N
2dcead08-84fb-4707-ae0d-dfa4c420ba35	0.1893789614908534	0.2562032053326682	\N	\N	\N	b0586d35-df0d-4b81-8c0b-60d0a6ed634f	\N
8e8e0bda-46c6-4862-a075-55a654247293	0.2288624606536277	0.2368406049904883	\N	\N	\N	f05d0a1c-b812-402b-b334-725a9e63a11d	\N
038ea788-f90e-4e7f-a1f3-c0aadb7d68c2	0.269665108379781	0.2574159136629859	\N	\N	\N	ee3489ea-5834-41a2-aa91-b024742847e5	\N
270af757-2bf3-4006-9709-ca7652bb5d60	0.2781975254718647	0.3039966387696992	\N	\N	\N	f3d80b81-48fa-4774-b5c3-748584cfecac	\N
df5e8142-0501-4efd-b5fe-19f370a28af6	0.245146322820319	0.3401154760073883	\N	\N	\N	2847c5cb-9900-4979-9ef3-a33ca0480c01	\N
0a026b86-816f-42d9-a82a-164f6a902daf	0.1948501786204614	0.3354622383230045	\N	\N	\N	ff32ede9-76b9-42e3-b190-1d6c9e5bb291	\N
3d442166-2fa7-418b-97bd-234e27113e76	0.1673608447149694	0.2913022237213184	\N	\N	\N	6bdb5a9f-0725-4bc1-bfc0-a236788049f7	\N
e97fdacc-38f9-4934-abcf-eae41120eacf	0.1864389525929298	0.2413400087815283	\N	\N	\N	2ebc90db-ef0d-422d-a399-6927949b58d2	\N
80b0c9df-a1d0-4d6e-8b90-ace6747b1a19	0.2391354612609234	0.2259221209742789	\N	\N	\N	012a0dc7-3805-4718-a246-33e4d9995757	\N
d9e8c20f-3ed5-470a-9f55-b76349414139	0.2844022143493704	0.2593885005125381	\N	\N	\N	bf83f60c-954f-43bd-896f-4e9af98d6e43	\N
17fb6cd1-8243-4d61-bcef-1a5e488e4b6b	0.2851530406658038	0.3170336639938598	\N	\N	\N	3615fd66-e445-4ed3-8c84-fa6a8220e844	\N
105592b5-0760-42c5-be9b-c57a22e8a8f0	0.2386642967407542	0.3533211606183476	\N	\N	\N	176be2e9-702b-405b-921d-9d09f352d714	\N
a667fafb-1859-4c97-8056-931ae7ef5108	0.1803920162857215	0.3379331981138798	\N	\N	\N	10e0a92f-64b2-4051-97b1-d8169ad8326f	\N
234fd688-f63b-43ab-8a1d-903552eb4012	0.2286206896551724	0.2018518518518519	\N	\N	\N	ac6edfec-979b-4a5c-9414-df15cfd520db	\N
a1d04c0e-ebb4-4683-83b8-e37c57116e8e	0.4703394547325854	0.1589234047145164	\N	\N	\N	673d6e5a-9fee-4013-8a2c-5d8beee96121	\N
c5ab0c55-2d88-448e-b73e-1bb482021b51	0.4518955463487493	0.1665466416738555	\N	\N	\N	6e481cba-8452-4313-b805-f6130c319f62	\N
91c4fbaa-fce8-4b12-98fe-51f416384daa	0.4323587917003456	0.1535984694001978	\N	\N	\N	5aca83b1-05fe-4396-9a2b-bbc21a360f9b	\N
7e8691bb-eac5-4615-a2ea-8e8ee4270490	0.4314686990576176	0.1271190779039759	\N	\N	\N	196079e5-0523-4941-8347-e6c8dbbe5272	\N
d746b74a-b014-490b-874e-8c04c41f397d	0.4544987970852421	0.109094793403751	\N	\N	\N	281811fa-ac00-4c94-a400-90192493191b	\N
ae6054a6-adbc-493d-a8d2-86e1c655c942	0.367103448275862	0.1902777777777778	\N	\N	\N	7d77cf6b-32a9-4f0e-b9b8-42686a558aed	\N
5051192d-c9de-4262-bbac-b51be10da832	0.3650980754222405	0.2060298861959979	\N	\N	\N	3b13e7da-97ed-49b5-9bf0-8bd21f8c27f3	\N
377f51b2-4b68-4681-9b43-ab688635bc87	0.3466541670384044	0.213653123155337	\N	\N	\N	06fd06bd-a4be-43f4-8bdd-da2b570df0e3	\N
c06478c7-04ac-4d01-b5bc-feb2e7d9bfca	0.3271174123900007	0.2007049508816793	\N	\N	\N	df5558c9-d6c2-42b0-982f-1561ac22343a	\N
6cf5b3f6-5dae-455e-8f26-bb2e9a787db4	0.2290344827586207	0.627199074074074	\N	\N	\N	d4dca1eb-398b-43b2-9733-6a4544296401	\N
78119a8b-c854-4e58-ae2d-e9ec8222a708	0.2270291099049992	0.6429511824922941	\N	\N	\N	5cfa3bc3-2645-4803-8e60-9e5239a224b6	\N
05c8b7bc-44f3-4c07-9d43-44922b16afad	0.396296285264514	0.4418181519780501	\N	\N	\N	662ac8f6-d0cc-41d6-a6fd-90458c351786	\N
f5038b2f-eb76-41dd-8b96-c946d630f35c	0.4193263832921386	0.4237938674778251	\N	\N	\N	5caf0606-7c80-4c4b-8560-5dd138500a7d	\N
cb03d538-b33a-4d1c-9281-9cfee22de782	0.4499392965946553	0.4322669724496259	\N	\N	\N	3f56a62c-1102-4826-8c27-bc212a07db29	\N
5adf9af1-6bf2-4d79-bd18-930ab67add54	0.4622845164941131	0.4640544970108648	\N	\N	\N	fd742210-154f-416b-ac2c-a158d6a35b23	\N
86bfff3c-360a-42c3-8f47-485ff3f1375b	0.4430860953375536	0.4948493547715979	\N	\N	\N	a53690fb-61a0-4d05-b05b-9eefc5b0f213	\N
8cee50f8-ffa8-473c-8b61-e99f28991020	0.4048771299402353	0.4981851640414657	\N	\N	\N	4c40a684-0bce-4fd8-b6bb-83b58709b421	\N
252e3ae6-92d8-479e-b89e-ab4c77ab4694	0.377907746492539	0.4682197613751213	\N	\N	\N	2495d2ec-400b-43e6-a7bb-f465fe08d81d	\N
e5952660-5268-47a6-98cd-da9563426986	0.3859306856287844	0.4268050571845201	\N	\N	\N	5e18a870-5f4f-4065-b766-2a6c6c0691e4	\N
74818665-862c-4979-88c9-9c4293d7dd34	0.4254141847915587	0.4074424568423403	\N	\N	\N	8bea76f4-b502-41cc-91f4-69c86a4e4965	\N
d9c66013-431c-4ced-8624-f69fe546d024	0.5552413793103448	0.5456018518518518	\N	\N	\N	87e9c350-63f3-4a21-822a-dea94e663317	\N
47be9c27-a6c5-449e-8a29-6e8a31e27197	0.5532360064567232	0.5613539602700719	\N	\N	\N	b07ba914-3b3a-417c-bbfd-6198ee0bee38	\N
b8cefd70-7d49-44bd-9148-4781cc25ea1f	0.5347920980728872	0.568977197229411	\N	\N	\N	8955d55d-8825-40ce-a237-d0554350b136	\N
823dcb2d-d444-4876-932a-c5f494933f82	0.5152553434244834	0.5560290249557533	\N	\N	\N	b7f624df-cfdf-4cd8-8752-1292d476be1c	\N
332c3e68-073f-4411-b0b2-a5b9107ca3bd	0.5143652507817554	0.5295496334595315	\N	\N	\N	d40200d5-8cd2-4fa9-adb2-1a97d9593965	\N
af2c059c-54b5-4918-af6e-5d1e958ccf36	0.53739534880938	0.5115253489593066	\N	\N	\N	0904898f-3d31-40cc-8578-6c1edfaecb08	\N
8049bb9e-0a0a-46fb-892c-e3a45825ed99	0.5680082621118966	0.5199984539311072	\N	\N	\N	34b86280-ebf7-4398-a216-1cd8daafd39e	\N
7106e048-805b-47d2-a437-6de8eda9c0f6	0.5803534820113545	0.5517859784923462	\N	\N	\N	4cd6a190-165b-4c50-919c-be6cfb3964a1	\N
33aaf27c-8ffd-4789-9f95-fd71c4846693	0.561155060854795	0.5825808362530793	\N	\N	\N	22ae3151-a13b-40df-8bea-dfea432f9d5c	\N
1eebf2c6-b691-4d7e-a563-e76942a7f218	0.8076551724137931	0.4412037037037037	\N	\N	\N	1ada61d8-de4f-4661-a71a-9f4a296091f2	\N
8095c8f0-68ff-4d3b-9317-4ccaa2299356	0.8056497995601716	0.4569558121219238	\N	\N	\N	34b88cc6-6e0c-4130-8737-8219793d7b20	\N
38a9fc87-f449-4822-ab30-0ef7de96ee2b	0.2450519904870707	0.5212046685091305	\N	\N	\N	682aad82-314b-4061-9254-5793ba89e8be	\N
98b5a7c6-1bad-4161-9d06-f24356f8c6d2	0.2767388985146335	0.467007567011309	\N	\N	\N	8850bce9-a838-461e-b5f7-596394def846	\N
fcb54a5b-d7ce-4ba4-9c0c-97d2b2373b18	0.3402699877181471	0.4592834998910003	\N	\N	\N	558617f8-a75f-41f8-b9d9-0720d71e7754	\N
ba429e07-31ac-4586-be6b-c850fda594c0	0.3857052259531035	0.5060379369907309	\N	\N	\N	380d8316-3a6f-40fc-b9f4-5df799f4cf14	\N
cf83cf66-85c2-4c39-9e07-48df05b89d0d	0.375816448355329	0.5716659108531962	\N	\N	\N	9b39a9d2-cbd1-4169-aec1-80c1e5acfa9d	\N
3c6d44f2-9b5c-4744-9943-e1a39b896858	0.316580582431817	0.6040760056801893	\N	\N	\N	97d00715-a9d7-4ad3-9506-1e23a2f6e434	\N
990e7413-c0c9-4ead-b6c7-5d10aed3811c	0.253888336258946	0.5760854746524848	\N	\N	\N	16fd6442-836d-4a3d-a3f5-12d9ce6bfe18	\N
bd18f5a1-8866-453f-845e-4740126c3002	0.3346895436134157	0.5643950723641904	\N	\N	74267976-27df-4d73-b736-b72bf1ddb19f	\N	\N
e09f6241-507d-449a-b3db-b9230ea53b51	0.2964805782160974	0.5677308816340582	\N	\N	bcd0f4f4-c967-4184-a201-1bd7e0d3d88e	\N	\N
ef5e15c7-2d65-4619-9a33-4eecc99090fd	0.2695111947684011	0.5377654789677138	\N	\N	8fc56667-67a4-426f-ad49-8edf2c48c9bf	\N	\N
12840fc2-9f9a-4085-856f-0d3e858c87a3	0.2775341339046465	0.4963507747771125	\N	\N	b2a3649c-ddc3-45a0-98fb-1f2453713afd	\N	\N
3924358f-8bea-455b-bcb7-3c3bf22d7202	0.3961379310344827	0.4819444444444445	\N	\N	\N	\N	7d71bc29-ee85-415a-b2b3-3ad9dcb83706
07c99f07-fc66-4e93-a2d3-95035a8a5827	0.3988965517241379	0.4773148148148148	\N	\N	23f62138-662c-47d5-855d-bdf7acf09462	\N	\N
e332451b-3f2d-4fc3-a28d-ec898f811846	0.2987586206896552	0.3815972222222222	\N	\N	\N	bcbef7a5-9109-44f2-a960-351ae35476db	\N
1457456b-4e3b-4a2a-8e63-5fc3c64566c0	0.2987586206896552	0.3815972222222222	\N	\N	\N	b9a0b7ee-5455-466d-86c0-12363226b383	\N
e3bffe79-538a-42f0-8182-18c7e811298a	0.2987586206896552	0.3815972222222222	\N	\N	\N	d21e951b-fd8b-4c35-9e35-b3cddbbacd47	\N
cc5cad36-c135-47c0-9f96-2cb2595feb3d	0.2987586206896552	0.3815972222222222	\N	\N	\N	bee18153-fe3c-4ffd-8e30-6e91eb31db5e	\N
3969b416-a2a8-41aa-829e-98b831167323	0.2987586206896552	0.3815972222222222	\N	\N	\N	87d809bb-833e-4fa4-8dff-17e9cd7f3af3	\N
e47ce9d6-e207-44ad-b66f-7ba784e57b2b	0.2987586206896552	0.3815972222222222	\N	\N	\N	0622d84c-e5c2-4c64-bac5-74479683daee	\N
c117d927-e441-4163-b097-cf869973f948	0.2987586206896552	0.3815972222222222	\N	\N	\N	41fa949e-a4a0-41b8-8c47-a3a6c080879f	\N
3debbb9f-53e5-4771-b2f9-6a4ca89b7561	0.2987586206896552	0.3815972222222222	\N	\N	\N	381eb3b5-c442-4fce-9388-e6df91d76f56	\N
f59c26dd-e5f0-47c2-a298-94d23a70ddd6	0.2987586206896552	0.3815972222222222	\N	\N	\N	67a5fa35-103d-4486-831e-078d56beedc9	\N
8db8a5a8-e17a-4689-902a-b4545da00df4	0.2987586206896552	0.3815972222222222	\N	\N	\N	f77d9ba9-30c8-4d94-b0c1-89420f643296	\N
b6e58588-f712-49a8-aa06-b8f8262f1b44	0.2987586206896552	0.3815972222222222	\N	\N	\N	e945a71d-9224-4272-8f9a-c6a775c22110	\N
468eb24a-a3e0-43b0-b0a4-61efe4132fae	0.2987586206896552	0.3815972222222222	\N	\N	\N	5e356a69-f3d4-4d03-8046-3f7f89c3512f	\N
02b24131-3388-4196-946b-5415c573db77	0.2987586206896552	0.3815972222222222	\N	\N	\N	c132e383-cfff-4c2d-a4c5-c03c7cf22527	\N
f7327716-ac07-4d67-a59e-d56f6cbc4d90	0.2987586206896552	0.3815972222222222	\N	\N	\N	05a5abd8-9df1-4c47-b688-aaff0a8054bb	\N
451d9deb-1aca-4bac-b595-a7df3746137a	0.2987586206896552	0.3815972222222222	\N	\N	\N	1fe493d9-3fe2-47bf-bae2-376183eae589	\N
c86a1227-4f3a-4004-bc3e-a03dbcb81552	0.2987586206896552	0.3815972222222222	\N	\N	\N	850749b4-7031-4dcb-8f1b-ab7fffcea695	\N
fc83325d-9444-47d2-a16b-cad3990cc47c	0.2987586206896552	0.3815972222222222	\N	\N	\N	522247e8-8a6e-4395-b4ad-f0048ea3a795	\N
81c2825b-7416-4520-bb68-f696ed75e9bb	0.2987586206896552	0.3815972222222222	\N	\N	\N	c22ad785-5424-4bcd-a113-3f25c99894d3	\N
fbe464d6-4c9c-4882-99d0-df8e9b03bbbd	0.2987586206896552	0.3815972222222222	\N	\N	\N	a831e174-ab51-47c3-92db-37b66cc35336	\N
02556220-17d9-40a7-8487-e3b97c16ce5c	0.2987586206896552	0.3815972222222222	\N	\N	\N	82991204-d47e-455e-b632-78371f6ae52f	\N
4510f74a-bf54-4b61-acd6-b749631eb880	0.2987586206896552	0.3815972222222222	\N	\N	\N	8771737e-2271-4026-b8a1-39795b4195b6	\N
3e06429b-8ff7-4c36-a3e2-3023f67bbfa0	0.2987586206896552	0.3815972222222222	\N	\N	\N	93fe4c22-d988-41c8-b440-6c4e0a805e14	\N
db714213-307b-45b1-bd8b-f330bc03e89b	0.2987586206896552	0.3815972222222222	\N	\N	\N	2842beda-2407-4743-8e3e-3b1a4e026bd5	\N
a94eaf4a-6af7-435b-9b07-aaacfde49bfc	0.2987586206896552	0.3815972222222222	\N	\N	\N	4bd40fea-9407-4dee-a06c-0803f4d44362	\N
b2f8de61-f7ce-443a-bbe4-a0dc89eb2684	0.2987586206896552	0.3815972222222222	\N	\N	\N	42d6a572-ed00-400a-8780-c2ce8d967481	\N
be403839-95a8-4a46-bcf6-a836b2c95157	0.2987586206896552	0.3815972222222222	\N	\N	\N	54f82a8e-b086-4414-bd1f-489455a0ad8f	\N
dcca1444-1a86-4132-89b6-45b8c45a35f5	0.2987586206896552	0.3815972222222222	\N	\N	423c1e1d-80fa-49b5-bc4c-16e3ab7c7254	\N	\N
77b0ffba-e6fe-419d-8d58-615225bc3709	0.2987586206896552	0.3815972222222222	\N	\N	c8465912-0c2c-41b2-ad4e-ff3d5216fee1	\N	\N
b6c3c08e-4513-42bf-a993-f5f036da44bb	0.2987586206896552	0.3815972222222222	\N	\N	7ba3af96-e3be-4a24-a635-4019fd735b43	\N	\N
e91e6f64-9e04-4d3c-ac9b-019e9f0d085c	0.2987586206896552	0.3815972222222222	\N	\N	7c5c384e-7ceb-4519-a8ec-306461834613	\N	\N
65eb4cb1-a31a-450e-9ca0-84c579b1413a	0.2987586206896552	0.3815972222222222	\N	\N	2cf8aa39-28d2-4c27-bf2a-a9d5330354f6	\N	\N
b59734b1-1ae0-4063-8fec-4c8c1bb2030d	0.2987586206896552	0.3815972222222222	\N	\N	e264e684-1f9f-449f-8174-dafafc097359	\N	\N
14e04706-180a-4f8d-b3a0-5708a8463076	0.2987586206896552	0.3815972222222222	\N	\N	13aa2067-8d79-4e62-95f8-96e49e059fe9	\N	\N
15812f19-3a4d-4708-9111-1785a1d38a41	0.2987586206896552	0.3815972222222222	\N	\N	1688db92-616d-4198-ad53-a0be9ceedcba	\N	\N
e14c783b-85ee-47f1-9848-12833b9c5311	0.2987586206896552	0.3815972222222222	\N	\N	\N	e7b4e596-3071-41cf-ae15-4501a6a3b167	\N
6e5e5214-6b44-4ace-b75e-34e64aca8989	0.2987586206896552	0.3815972222222222	\N	\N	ab0c8d88-3f3b-41cc-809f-3cde159f2fad	\N	\N
8707e3d0-116c-4b17-bd72-0698dd237ee6	0.2987586206896552	0.3815972222222222	\N	\N	\N	9c4db771-dbb1-4418-8c62-9d2e81e2290f	\N
8b545959-7e9f-4ba8-ab41-0a9d91c1b9db	0.2987586206896552	0.3815972222222222	\N	\N	\N	55ab84f0-5613-4c07-a940-0cf0ed52efd8	\N
0f45e7cb-2940-4a54-a28f-bb889a4d3be9	0.2987586206896552	0.3815972222222222	\N	\N	52c62675-fc63-422a-9a18-ec13ca8256b8	\N	\N
5daa0ebb-1829-4e75-9835-0a8b3e8f7b15	0.2987586206896552	0.3815972222222222	\N	\N	\N	e40dc39d-150f-4f7b-ba94-1b13f0526ec0	\N
fa9bb430-8631-43a9-8bce-52c8715247ee	0.2987586206896552	0.3815972222222222	\N	\N	d8ee7264-dfaa-4851-81dc-d94e529ad548	\N	\N
bc3dfc93-ab36-4e09-99fb-f04722e242e7	0.2987586206896552	0.3815972222222222	\N	\N	55939ea9-a45e-42b4-8603-ded4f2701070	\N	\N
cd40e004-c922-4252-bd1d-eab42848a524	0.2987586206896552	0.3815972222222222	\N	\N	\N	7aeb95f1-d0ca-4772-8844-781dbfe61592	\N
4bbd1576-b4cc-408c-baf2-731a8ae35a32	0.2987586206896552	0.3815972222222222	\N	\N	c287aadd-d73e-43b5-8223-813e59ed8350	\N	\N
56a61cd3-4e0e-447d-8dbe-e52afb2152a8	0.2987586206896552	0.3815972222222222	\N	\N	\N	3fd5bad4-7fd4-4c2e-9843-4b3e84867301	\N
f814c531-93be-4cec-be2d-73c6f907fd5b	0.2987586206896552	0.3815972222222222	\N	\N	\N	8526b213-2af7-4522-9da0-8ff499bd9cf5	\N
cf6e291f-95fa-4049-bece-128e9837b116	0.2987586206896552	0.3815972222222222	\N	\N	d902d048-c851-4cc8-b19e-5936ccf928b7	\N	\N
b84979d6-6d29-4506-9ccf-09501722a5cc	0.2987586206896552	0.3815972222222222	\N	\N	\N	036cc087-0782-4d13-8cf5-f489d0b0839f	\N
41c11910-d8ed-45a3-a545-8db080518674	0.2987586206896552	0.3815972222222222	\N	\N	2022752e-1367-4834-8dae-099de55c5977	\N	\N
1f96542d-60aa-40a6-83ba-ddd9fd9889a5	0.2987586206896552	0.3815972222222222	\N	\N	\N	0b636012-fa99-47bc-9147-8b8db7a4f6e9	\N
5bf76032-349d-48ea-8180-2895e0d9d543	0.2987586206896552	0.3815972222222222	\N	\N	a5cb4ff0-5ca6-435c-b0c9-8efa963114ff	\N	\N
2812088d-2558-4297-a0ae-4f0736ad2534	0.2987586206896552	0.3815972222222222	\N	\N	\N	6a5b7b66-69da-4d52-ae5c-429c06c4e922	\N
10c32ee5-6839-42ee-adac-266e69921f51	0.2987586206896552	0.3815972222222222	\N	\N	\N	2ac16f69-2071-4585-ba34-c47f54e856d9	\N
a4e8b969-fcf4-4c3e-ad15-e96547d74009	0.2987586206896552	0.3815972222222222	\N	\N	\N	589e87f0-c830-415f-9667-71c9833766bd	\N
a84c64f6-847d-4180-b8d5-9592f65a423e	0.2987586206896552	0.3815972222222222	\N	\N	\N	11bbab3d-082b-4d21-99bc-2295684d1ee2	\N
2de429db-5225-452a-bd47-7a30c9200ad0	0.2987586206896552	0.3815972222222222	\N	\N	\N	08c849e8-8e2c-47e0-a26d-764c484d897d	\N
1139fc6d-68f8-4c96-8207-68194a559560	0.2987586206896552	0.3815972222222222	\N	\N	\N	e785fe6c-da97-416c-95a6-4102791b6640	\N
11a8c393-5e3b-4b5a-a570-2baceaaf5999	0.2987586206896552	0.3815972222222222	\N	\N	\N	71a8a898-169f-435b-bf0a-8c3933c60a8d	\N
e876ccc2-7d3d-4278-9b26-b9bfc6968ff8	0.2987586206896552	0.3815972222222222	\N	\N	\N	5f7057a8-b5e3-4947-b846-16f62dd43d39	\N
dcafe1ed-4a30-4194-ad73-c5c457a64110	0.2987586206896552	0.3815972222222222	\N	\N	\N	35c5cd56-05ab-4d10-9489-bf09f3c1d9cc	\N
d6979d7b-5424-431b-b994-37f42456e90d	0.2987586206896552	0.3815972222222222	\N	\N	\N	4b898112-8241-4622-986f-b38d364315ae	\N
1868158e-1904-4155-8f15-d26f5f8391d0	0.2987586206896552	0.3815972222222222	\N	\N	\N	d8e37ee1-afd3-4901-ba1b-74bc0479acd3	\N
7740000c-6044-4a05-bf10-9872ab5535ec	0.2987586206896552	0.3815972222222222	\N	\N	\N	dbbe28fc-23e4-4d1a-af4c-0e15291ee906	\N
c10badc9-cf5d-49ee-b213-67755bfb2149	0.2987586206896552	0.3815972222222222	\N	\N	80349e8d-a048-4ded-9e45-2ed44d91915c	\N	\N
b69c3782-e4b0-47c6-9fdb-bb9c3034a0ba	0.2987586206896552	0.3815972222222222	\N	\N	3cce4b25-ed03-4615-9c07-009156e6c346	\N	\N
03cdc3c8-da9e-4357-8a22-b4cd0f402ba3	0.2987586206896552	0.3815972222222222	\N	\N	39f35f74-b359-4703-90c3-bf89b9bc32b5	\N	\N
ccdbb1de-07d1-4fc6-be77-52d88b09c848	0.2987586206896552	0.3815972222222222	\N	\N	59bfd806-93be-4b93-85ed-e985413ba43b	\N	\N
127f99cb-f14c-43cb-9af1-6fb9ec060b11	0.2987586206896552	0.3815972222222222	\N	\N	0ea8ef5f-909a-4aec-ba78-472a26bb618c	\N	\N
6da9068c-5dcd-4d01-b834-f0404bf13934	0.2987586206896552	0.3815972222222222	\N	\N	28bbfaf5-c052-4315-9b89-221646c69b63	\N	\N
5c492988-4730-4612-9e8e-9057acb6a312	0.2987586206896552	0.3815972222222222	\N	\N	0def10a3-503b-47b2-9ef3-45c42ef5bc28	\N	\N
6cd20f87-d065-4ace-a6bf-e37d225fa5a7	0.2987586206896552	0.3815972222222222	\N	\N	19e566a4-91ad-46a3-998d-eadaacf6a719	\N	\N
97dcd1b3-ce9f-4952-b73e-fbb70023ff1b	0.2987586206896552	0.3815972222222222	\N	\N	db659a2c-6014-494e-864e-1e1b09b29e13	\N	\N
7c6e91fe-3471-4fc1-abe4-3c65c1c3fac9	0.2987586206896552	0.3815972222222222	\N	\N	c3f61c29-3710-4502-89da-263ea482fd57	\N	\N
6dd048fd-e551-4a99-9015-cca4a9e58bf9	0.2987586206896552	0.3815972222222222	\N	\N	66c5d788-a8da-4096-82a8-5f7089e6a657	\N	\N
3bcbdbbe-270f-4a1b-9570-1e4a820db2f0	0.2987586206896552	0.3815972222222222	\N	\N	1afe313c-9ddc-445a-a189-57a654ac067b	\N	\N
f804f1e1-effa-4c7a-b0ba-d521eab637df	0.2987586206896552	0.3815972222222222	\N	\N	323a062a-bdb2-42c8-b57b-de9f968d6829	\N	\N
a550d799-2dbc-4edd-9e08-2fb010d29c5d	0.2987586206896552	0.3815972222222222	\N	\N	\N	c885e82c-e64e-48e8-8136-5f76d4d4611b	\N
b22a2817-8b5b-4a5c-81ff-2b1c04ed08b6	0.2987586206896552	0.3815972222222222	\N	\N	\N	32f901e7-8a07-44df-8854-b00536c41603	\N
85892fd1-3964-43d8-bdef-609e1a1d28f8	0.2987586206896552	0.3815972222222222	\N	\N	\N	148f0452-aa0f-42b1-83a4-23cb30cd0e18	\N
8f879226-bff9-4a70-a53c-a17e750116e7	0.2987586206896552	0.3815972222222222	\N	\N	\N	abea18f1-9c07-449b-ab79-775016062e80	\N
5d04c798-7aff-4c85-be4a-cef9b479e15e	0.2987586206896552	0.3815972222222222	\N	\N	\N	7a98f51c-2382-4a3c-9972-d28bd933e25c	\N
0f2ee02c-138a-451b-8fa1-7880ceeea2c7	0.2987586206896552	0.3815972222222222	\N	\N	\N	80891668-5ad8-47a2-ae29-1e6d79be3160	\N
43efcd55-99c1-44cc-a701-0797f8506c63	0.2987586206896552	0.3815972222222222	\N	\N	\N	3037c0fe-d341-42a8-8eaa-3706786a5ed2	\N
7e8ff837-a462-4ab2-bb42-1e19dfe000fe	0.2987586206896552	0.3815972222222222	\N	\N	\N	ac6c4a4a-5f2c-4a4c-b2a9-357ac2923860	\N
87a15b10-5b72-4124-933b-26cf2ac5877b	0.2987586206896552	0.3815972222222222	\N	\N	\N	8bee4975-3867-46b2-92dc-b0aadd21b17d	\N
f16bbfac-6b14-4f5a-bfd7-93c667db7358	0.2987586206896552	0.3815972222222222	\N	\N	\N	38b3360c-8a20-408c-ada3-195cbb1fe0eb	\N
dd050a7a-0b61-412b-8391-db15263c1395	0.2987586206896552	0.3815972222222222	\N	\N	\N	1e0c5487-24ff-4d0c-8b7e-e71cafc7345e	\N
9d04ea5c-2cf1-4af1-9e27-a79f24569e50	0.2987586206896552	0.3815972222222222	\N	\N	\N	8c2eeaa5-9a2f-4d9f-8fa6-014fa6a70c0b	\N
73d9ee7c-5ed4-4369-b569-a1d6c31a15d5	0.2987586206896552	0.3815972222222222	\N	\N	\N	fe11f5e3-b52a-446f-b6bd-18cf660a6eb9	\N
2fba8c38-1a1c-4bda-96c4-1e832f465d32	0.2987586206896552	0.3815972222222222	\N	\N	\N	fa0063c9-958b-461c-b5ee-42fb880375bc	\N
a451212a-1443-481d-a04a-5b62763894f8	0.2987586206896552	0.3815972222222222	\N	\N	f3bdda3c-f825-4e5e-8b75-f589fd4cfa45	\N	\N
21052e6b-e31f-444d-b1c0-bb929995de2f	0.2987586206896552	0.3815972222222222	\N	\N	8e1d1ab4-e91d-4e19-b468-d8b5ec2dcabe	\N	\N
3fc185ff-653d-46e0-91c1-3109b2d5d6c3	0.2987586206896552	0.3815972222222222	\N	\N	b3cd0022-1395-4c21-8e4e-8a5252988d95	\N	\N
25fb7116-2a06-408e-8cdf-ff962638ffde	0.2987586206896552	0.3815972222222222	\N	\N	8781872b-0799-4922-aa83-2fcbfb39e00d	\N	\N
29068479-646d-4495-b059-e71f40f8a31c	0.2987586206896552	0.3815972222222222	\N	\N	63ac8f6d-3832-46a5-b0a1-7e85ab8a39a1	\N	\N
88ed21b0-69df-4a71-a5cc-58c8a25a9d48	0.2987586206896552	0.3815972222222222	\N	\N	f397d94e-7139-4873-aee4-4d81d6fa8197	\N	\N
e0b0db77-b68a-4d1b-bc5b-81a33fe55362	0.2987586206896552	0.3815972222222222	\N	\N	10917852-538d-4ac5-9822-db917deda21c	\N	\N
4f2052d6-77ca-446b-8fa1-e8750f3cc304	0.2987586206896552	0.3815972222222222	\N	\N	\N	e38ec34b-0893-4e6c-ad45-417865304a21	\N
6d70eae1-2623-47b6-b827-405628c07daa	0.6631724137931034	0.6361111111111111	\N	\N	\N	52ab9bce-74dd-49b3-85c1-d519c83340f3	\N
6b6e9cac-45a2-4e52-a352-7821c78e2bf3	0.6631724137931034	0.6361111111111111	\N	\N	\N	8e568e50-446f-4ccf-ad74-ba8fade07a59	\N
437c2988-8d2b-4d42-a546-b406913a3729	0.6631724137931034	0.6361111111111111	\N	\N	\N	6951831e-2bb4-40e2-9ecc-bc3cacde1eb4	\N
21b95190-f63a-461d-9113-433d7eea5ee2	0.6631724137931034	0.6361111111111111	\N	\N	\N	636aae36-ee4c-4d40-aa22-95409a1f732d	\N
625e27bb-9fe7-4886-8c58-9f6b385f7374	0.6631724137931034	0.6361111111111111	\N	\N	\N	cea2b827-0f64-4644-b53a-934619178521	\N
74cd964a-119c-4411-8d5c-9e9b70a4a359	0.6631724137931034	0.6361111111111111	\N	\N	\N	be422053-19d2-4236-bda9-702c8d9432ee	\N
db3a3028-d318-488d-9f76-3e877800472b	0.6631724137931034	0.6361111111111111	\N	\N	\N	9a7b6933-5dc5-4e0b-87a1-cf3ac490f268	\N
90dd8021-abe5-44d0-b4e4-c1f9edb29bc0	0.6631724137931034	0.6361111111111111	\N	\N	\N	6770be44-0782-4653-980a-925ff9676607	\N
fd03df34-841a-4535-85e2-2eeb22498acc	0.6631724137931034	0.6361111111111111	\N	\N	\N	110efc91-cda4-49e9-8633-f1c68bb51010	\N
05c781ea-a599-48c0-a0ed-13a12bc9e7bf	0.6631724137931034	0.6361111111111111	\N	\N	\N	c5b0da05-e204-4613-9e64-cf5aad95f53b	\N
51c8d6a1-0d41-49c3-bbcf-1876eea582d0	0.3602758620689655	0.4199074074074074	\N	\N	\N	\N	119caa2d-452f-4136-b964-1e4208ccd37a
39bef7ef-8ec0-4d50-9686-a710310d47f4	0.2940689655172414	0.8217592592592593	\N	\N	7c3aba96-d0a3-4ce2-bb34-c962aadd3fd0	\N	\N
5fad32cc-6bef-49d7-bf5f-563482ac06ea	0.4402758620689655	0.1759259259259259	\N	\N	\N	2237610a-899b-4f8b-8c6c-0ad0b7f50fba	\N
702b8040-9d6e-45fd-b777-ae27d84b71d8	0.4402758620689655	0.1759259259259259	\N	\N	\N	290b1fc7-4fa4-4591-a2e9-bea0cb0e6a5b	\N
e5de394f-e439-4a36-83de-1d2a11e5d4d9	0.4402758620689655	0.1759259259259259	\N	\N	\N	c73f7e66-4bad-41b9-89ec-f16db2d8ee91	\N
b40410ed-ca6c-48f0-af72-473bb5021a19	0.4402758620689655	0.1759259259259259	\N	\N	\N	b6d601cd-8b88-4656-a0d3-c8fb6c10808d	\N
6eea722e-9e3b-471d-9a10-bf43987b0824	0.4402758620689655	0.1759259259259259	\N	\N	\N	b5122e37-4f00-4169-8d83-031c7d3981f5	\N
95625054-f3a8-4e30-b150-aefe4fe620f4	0.4402758620689655	0.1759259259259259	\N	\N	\N	b9fdbf2d-b7cb-4baa-b60b-eaf54dbd8865	\N
04d4fb22-005d-4c48-b64c-0320eb66efa1	0.4402758620689655	0.1759259259259259	\N	\N	\N	da127a39-9689-4b08-a0c7-8467321f650e	\N
0704c604-8f36-4215-a63b-c7946628e530	0.4402758620689655	0.1759259259259259	\N	\N	\N	5292d7d4-ab2e-4ddf-83a0-6aa4f78ce713	\N
57dfd1dc-5561-4e1f-9c10-87a242d2fb32	0.2987586206896552	0.3815972222222222	\N	\N	fac35b8f-767d-466f-8ecf-5329226a4653	\N	\N
78319cfa-8f4c-4eae-9739-c46f36111e7b	0.2987586206896552	0.3815972222222222	\N	\N	\N	2b1aab71-b65d-4ff1-b3cd-fbb968ed1411	\N
30cf0a7c-ae24-4550-b1b5-dff2409e35be	0.2464827586206897	0.3752314814814815	\N	\N	\N	\N	72c85b73-2ad5-4add-b772-b9e3bf603b3e
\.


--
-- Data for Name: Quest; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Quest" (id, title, description, status, notes, "order", "createdAt", "updatedAt", "campaignId") FROM stdin;
6aaff261-17f4-4dd1-992c-285ee8936c08	Échapper à la Main du Silence	Neuf Nuits est un mage recherché par l'Ordre — la Main du Silence traque les magiciens clandestins de la Brèche en Momoritanie. Rester caché, éviter les patrouilles, semer les poursuivants.	TERMINEE	La patrouille postée au hameau a été anéantie cette nuit par des cavaliers Beor Khan — d'autres garnisons de l'Ordre risquent d'apprendre sa présence dans la région.	0	2026-07-10 19:58:49.029	2026-08-13 16:03:54.939	e30a0303-cbac-4684-956a-a19ff6d1e761
e2a20feb-d330-473a-a487-e435b27f2cee	Bal Tovalis — « Le Bal de la Pierre » (Soir 1)	Premier des quatre bals de la Fête de la Fondation, au Palazzo Khaz'Kanoon. Ambiance mondaine et robuste, sous laquelle avancent trois intrigues.	A_FAIRE	Indices semés ce soir — Port : Ordan provoque, Maerin dit qu'Eldric ne signe plus, Ismara confirme le contrat Haldor. Esclavage : Selianne annonce sa loi, un Mastiggia rôde. Roi : convois nocturnes (Bord Amac) + dossier « Les Yeux dans la pierre » / salut « Rayon » (Harl Denvar).\nFocus PJ : Compagnie Rigart → Illevas (libérer Eldric + contrat Haldor) ; Esclavagisme → Ezbehar (Mastiggia / Palhindile) → enchaîne sur le Bal Palhindile (Soir 2, abolition).	5	2026-08-23 18:48:21.829	2026-08-31 14:14:23.824	b53a0e0e-f892-40bc-add4-08714b7c88ce
bbba17fb-134a-42b6-b960-749bee1aebfd	Gagner la confiance des Beor Khan	Le groupe est amené au camp nomade des Beor Khan dans les steppes, menés par le chef de guerre Drogan Kharvek et la grande druide Sylvae Irithiel — celle-ci observait déjà Neuf Nuits sous forme de corbeau avant l'attaque du hameau.	ECHOUEE	Les Beor Khan se méfient des mages mais sont en guerre ouverte contre l'Empire et la Main du Silence. Ils proposent un marché : ramener la cape de plumes de pégase volée à leur ancêtre Vaskar Skoren, conservée en trophée dans le tertre des Ombre. En échange : protection, guides, dissimulation face à l'Ordre.	1	2026-07-10 19:58:49.029	2026-08-13 16:03:54.943	e30a0303-cbac-4684-956a-a19ff6d1e761
2435c9ec-8155-4284-b1d6-11e180f136ec	La cape de plumes de pégase	Récupérer, dans la Salle des Trophées (16) du tertre des Ombre, la cape faite de la dépouille du pégase de Vaskar Skoren — trophée pris par Zarak Solara lors de sa conquête des steppes.	EN_COURS	La décrocher sans prononcer les paroles funéraires beor khan (transmises par Sylvae) réveille l'esprit du pégase, lié à l'objet : un spectre hostile qui ne se calme qu'en lui rendant son honneur (Religion/Persuasion DC 15). Le tertre abrite aussi Huit Nuits (nécromancien du Monastère des Nuits), posté en salle 8 — il cherche le cœur de Zarak Solara, pas la cape ; ses intentions envers Neuf Nuits, autre disciple du Monastère, restent à définir.	2	2026-07-10 19:58:49.029	2026-08-13 16:03:54.945	e30a0303-cbac-4684-956a-a19ff6d1e761
9e8baa90-d4ba-4036-a577-8bae3380b9be	Le cœur de Zarak Solara — agenda de Huit Nuits	Huit Nuits, nécromancien issu du Monastère des Nuits comme Neuf Nuits, attend dans la Chambre du Cœur (salle 8 du tertre des Ombre) — il traque le cœur du mage noir Zarak Solara, exécuté et enterré en plusieurs lieux distincts.	EN_COURS	Fil d'arrière-plan : pas une quête du groupe à proprement parler, à utiliser si les joueurs croisent Huit Nuits ou s'intéressent à son objectif.	3	2026-07-10 19:58:49.029	2026-08-13 16:03:54.946	e30a0303-cbac-4684-956a-a19ff6d1e761
62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	Le Fretin — libérer Darn Fer-Vallée	Brynn Fer-Vallée supplie les PJ de récupérer sa sœur Darn, retenue par sa propre bande, le Fretin, dans les égouts de la Porte Basse (grille derrière le marché aux bestiaux). Il ignore pourquoi.	TERMINEE	Sur place, les PJ découvrent la vérité : le Fretin sert de passeur aux Mastiggia pour un trafic d'esclaves revendus à une cité vampire souterraine (Nharivum, sous Mongar). Ils tombent sur une transaction à trois — Fretin + Mastiggia (Vittore) + émissaire vampire (Sélas Vharkorn) et son Vampirien. Combat final : Vampirien FP 5 x1, Bandit capitaine (Sesk Orlo) FP 2 x1, Malfrat FP 1/2 x6. Twist : une partie du clan Ezbehar a été déportée par ce circuit à Nharivum comme nourriture et main-d'œuvre. Les Mastiggia détournent des esclaves de l'Œil Pourpre — secret explosif contre le Roi.	4	2026-08-13 14:38:12.753	2026-08-23 21:23:47.125	b53a0e0e-f892-40bc-add4-08714b7c88ce
d56f6a33-a98e-4dd2-920e-211110b3dcf1	Bal Palhindile — « Le Bal des Verrières » (Soir 2)	Deuxième des quatre bals de la Fête de la Fondation, chez les Palhindile, sous les verrières du Palais des Ambassades. Ambiance feutrée et diplomatique : la Chancellerie y dévoile sa proposition d'abolition de l'esclavage, et les Maisons choisissent leur camp.	A_FAIRE	Focus : l'abolition de l'esclavage (Édit d'Affranchissement porté par Selianne Palhindile / la Chancellerie) — payoff du fil Ezbehar du Soir 1.\nCamps — POUR : Palhindile ; CONTRE : Mastiggia + Couronne/Soleil Pourpre (en coulisse) ; INDÉCIS : Cilovard, Tovalis, délégations dolomicienne/gandorenne.\nLevier des PJ : la preuve du Fretin (livraisons Mastiggia → vampires). L'état des voix se reporte sur le Soir 3 / le vote au Conseil.\nFil secondaire : Rigart / Illevas (les Cilovard sont présents).	6	2026-08-31 14:51:10.985	2026-08-31 14:51:10.985	b53a0e0e-f892-40bc-add4-08714b7c88ce
\.


--
-- Data for Name: QuestStep; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."QuestStep" (id, "questId", title, description, status, "order", "createdAt", "updatedAt", optional) FROM stdin;
30064e1e-67cf-4387-b137-6c6931e9b23d	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	L'accroche — Darn Fer-Vallée	Darn vient trouver les PJ, blême : sa sœur Brynn est retenue « en bas » par sa propre bande, le Fretin (Porte Basse, grille derrière le marché aux bestiaux). Il croit à une dette ou une punition de contrebande — il ignore le fret humain. Trop identifiable (garde Tovalis) et trop à cran pour rester lucide, il confie l'extraction aux PJ.\n\nOptions d'accroche :\n— Il les paie (bourse) ou promet une faveur de la maison Tovalis / de Harl Denvar.\n— Il sollicite directement un PJ déjà lié à Brynn ou à Darn.\n— Il les intercepte au sortir du bal Tovalis, en pleine nuit.\n\nCe qu'il peut fournir : le plan de la grille, un contact sûr (La Roue de Secours), et l'heure où les Rats montent/descendent.\nTon : l'urgence d'un frère qui a peur, pas d'un commanditaire.	FAITE	0	2026-08-13 16:03:54.95	2026-08-22 08:47:32.866	f
e067aede-ddb0-4c27-9180-393faab2a57c	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	Trouver l'entrée	La grille descellée est derrière le marché aux bestiaux — bruyant, bondé, puant (couvre l'approche, gêne le repérage). Un guetteur du Fretin planqué en gamin de boucher / mendiant surveille l'accès.\n\nOptions :\n— Discrétion : contourner, attendre la tombée de la nuit, se fondre dans la foule du marché.\n— Social : corrompre ou bluffer le guetteur pour obtenir le contresigne d'entrée (utile plus loin).\n— Force/Intimidation : le neutraliser vite — efficace mais risque d'alerte s'il crie.\n— Alternative : une autre bouche d'égout plus loin, non gardée, mais trajet plus long et plus insalubre.\n\nÉchec bruyant ici = le repaire peut être prévenu (voir « La descente »).	FAITE	1	2026-08-13 16:03:54.95	2026-08-22 08:47:31.325	f
d1d20155-60ab-4f6d-81bd-1e16317ebc5f	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	La descente dans les égouts	Tunnels en dédale (« boyaux »), eau montante, poches de gaz, courant qui emporte le matériel. Le Fretin a laissé des surprises.\n\nOptions / obstacles :\n— Suivre les traces fraîches du convoi (Survie/Investigation) pour ne pas se perdre.\n— Bête de garde lâchée dans un tronçon (rats géants, charognard) : l'éviter en discrétion, ou l'affronter (bruit = alerte).\n— Fils à clochettes en travers d'un boyau : les repérer et désamorcer (Perception/Dextérité). Échec = le repaire est prévenu → cargaison déplacée, garde renforcée, compte à rebours enclenché.\n\nChoix de fond : rapidité contre discrétion. Chaque alarme rapproche le départ de la cargaison.	FAITE	2	2026-08-13 16:03:54.95	2026-08-22 08:47:29.728	f
c523afe0-b514-4341-9c9f-dc8f9c235c57	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	Le poste de garde	L'alcôve-repaire a un sas gardé. Trois voies d'entrée.\n\nOptions :\n— Bluff : se présenter comme acheteurs, recrues, ou convoyeur en retard, contresigne à l'appui.\n— Infiltration : trouver un passage détourné / une conduite pour contourner le sas.\n— Assaut : forcer — rapide mais bruyant, met tout le repaire en alerte.\n\nCe qu'on peut apprendre en écoutant avant d'agir : « le client est en bas », « la cargaison part cette nuit », le nombre d'hommes présents. Pression temporelle posée — sans rien révéler encore de la nature du fret.	FAITE	3	2026-08-13 16:03:54.95	2026-08-22 08:47:27.523	f
059df6e1-95a7-4815-a30d-2910bb0a44c8	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	La découverte (le choc)	La salle du fond : d'abord la contrebande banale (poudre de marbre, tonneaux, armes), puis une caisse qui respire, une main qui dépasse, des carcans gravés du monogramme Mastiggia. La marchandise, ce sont des gens.\n\nOptions de réaction :\n— Ouvrir discrètement une caisse pour confirmer (et rassurer un captif).\n— Rester caché pour observer la transaction en cours (renseignement maximal, mais l'horreur continue).\n— Intervenir immédiatement (on perd l'effet de surprise mais on stoppe l'inspection).\n\nIndices à collecter sur place : les carcans, le sceau « Larmes d'Ambre », un registre de livraison. Preuves réutilisables plus tard.	FAITE	4	2026-08-13 16:03:54.95	2026-08-22 08:47:26.244	f
e2d16eaa-cbbe-45a0-ac00-0207ec031eaa	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	L'exfiltration	Sortir avec Brynn et le cheptel affaibli, sans laisser l'émissaire filer prévenir Nharivum.\n\nOptions de sortie :\n— Par la grille du marché : rapide, mais au grand jour = risque de guet urbain… et peut-être de l'Œil Pourpre, qui reconnaîtrait « sa » marchandise détournée.\n— Par une autre bouche d'égout : plus long, plus discret.\n— Planquer les captifs à La Roue de Secours (contact de Darn) et les sortir la nuit.\n\nComplications possibles : tunnel qui s'inonde, passage qui s'effondre, poursuite de la muscle Mastiggia si Vittore a fui, un captif blessé qui ralentit le groupe.	EN_COURS	8	2026-08-13 16:03:54.95	2026-08-22 08:47:21.31	f
4b790c8e-afe6-46bc-866f-51ce0be343dc	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	Libérer Brynn	Brynn est bouclée dans un cul-de-basse-fosse à côté de la salle d'échange — retenue parce qu'elle a compris.\n\nOptions :\n— Crocheter / forcer la serrure, ou arracher le trousseau à Sesk.\n— La libérer avant le combat (discret) ou pendant (sous pression).\n\nÉtat de Brynn : affaiblie, en état de choc, honteuse.\n— Peut aider : elle connaît les lieux, les habitudes de la bande, une sortie de secours.\n— Peut gêner : panique, cris, gestes brusques.\n— Peut devenir un levier : si un Fretin la prend en otage pendant la bagarre.\nLa calmer sans la braquer referme son arc (complice inconsciente → témoin).	FAITE	6	2026-08-13 16:03:54.95	2026-08-22 08:47:18.793	f
9351ccf7-769a-4870-a4e4-e6355b2f81cc	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	La transaction à trois	Échange tripartite en cours au fond du repaire :\n— Le Fretin : Sesk Orlo + hommes de main (le passeur).\n— Les Mastiggia : Vittore, qui vend et empoche.\n— L'acheteur vampire : Sélas Vharkorn, émissaire de Nharivum, escorté d'un Vampirien qui inspecte le « cheptel ».\n\nOptions :\n— Attaque par surprise : avantage au premier tour, mais met les captifs en danger immédiat.\n— Parlementer / écouter : Vittore lâche des informations, minimise (« marchandise légale »), tente de corrompre ou de gagner du temps.\n— Se positionner d'abord : couper les issues pour empêcher Sélas et Vittore de fuir avant de frapper.\n\nDécision clé : neutraliser qui en premier — le Vampirien (menace), Sesk (moral de la bande), ou bloquer les fuyards.	FAITE	5	2026-08-13 16:03:54.95	2026-08-22 08:47:24.558	f
f19344b4-d6b0-4aec-af1c-de37795562ff	e2a20feb-d330-473a-a487-e435b27f2cee	Le pic mondain — l'incident	Temps fort à déclencher au bon moment : un pli remis à Daren qui le fait blêmir (son dossier secret sur le Soleil Pourpre), ou un accrochage Ordan ↔ Lorian Cilovard qui manque de dégénérer.	A_FAIRE	8	2026-08-23 18:48:21.829	2026-09-06 14:23:31.192	f
9d65d506-f6ca-4b65-9fcd-6a019810eac8	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Le pari du balcon (Velric)	On lâche une pièce dans l'excavation et on mise sur le temps avant l'écho… qui ne vient jamais. Mise en jeu ; Intuition DC 12 pour flairer l'arnaque. Gagner l'estime de Velric = un contact pègre pour plus tard.	A_FAIRE	10	2026-08-23 18:48:21.829	2026-09-06 14:23:31.193	t
517e8d81-aa54-4b46-b456-22bad6f62e59	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Bras-de-fer contre Bœuf-de-Pierre	Ancien tailleur devenu colosse de fête. Force (Athlétisme) opposé — imbattable jusqu'à son 6e verre (le faire boire d'abord). Récompense : réputation + une bourse.	A_FAIRE	11	2026-08-23 18:48:21.829	2026-09-06 14:23:31.194	t
5ede0402-97c9-4185-83f7-79151c15fad5	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	Le combat final	Composition : Vampirien (FP 5) x1 · Sesk Orlo, bandit capitaine (FP 2) x1 · Malfrat (FP 1/2) x6.\nVittore ne se bat pas : il négocie (« aucune juridiction ») ou s'éclipse — à rattraper = preuve vivante. Sélas fuit vers Mongar s'il le peut → Nharivum sera prévenue.\n\nOptions / tactique :\n— Exploiter les faiblesses du Vampirien : lumière du soleil, dégâts radiants, eau courante (bloquent sa régénération). Le repousser dans le courant d'un égout, un sort de Lumière du jour, l'attirer vers une bouche éclairée.\n— Briser le moral du Fretin : si Sesk tombe, les malfrats peuvent fuir ou se rendre.\n— Empêcher les fuites : bloquer Vittore et Sélas (leads + preuves).\n\nEnvironnement : obscurité, caisses comme couverts, eau courante à exploiter, risque de blesser les captifs dans les tirs/zones.	FAITE	7	2026-08-13 16:03:54.95	2026-08-22 08:47:17.203	f
ffb44863-e227-4a8e-9a6d-ce52e5a976b4	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	Résolution & retombées	Selon le déroulé :\n\nPreuves anti-Mastiggia (registre de Vittore, jetons, carcans) — options d'usage :\n— Les remettre à Selianne Palhindile pour appuyer la loi d'abolition / le bal Palhindile.\n— Les monnayer contre une faveur ou de l'or.\n— Les utiliser contre le Roi : dénoncer à l'Œil Pourpre que les Mastiggia lui volent sa marchandise → le Tyrannœil les écrase.\n\nSort de Brynn : rachetée (se rapproche de Darn) / brisée / morte selon la protection offerte.\nSort des antagonistes : Vittore & Sélas capturés (mines d'infos) ou échappés (ennemis rancuniers).\nFil ouvert : le clan Ezbehar déporté à Nharivum, sous Mongar — amorce d'un futur arc « descente à la cité vampire ».	EN_COURS	9	2026-08-13 16:03:54.95	2026-09-06 08:04:08.242	f
d4bf1aab-d990-4767-bdd9-e1d9f692871d	e2a20feb-d330-473a-a487-e435b27f2cee	Arrivée & présentation	Au Palazzo Khaz'Kanoon (marbre kintsugi, balcon sur l'excavation illuminée). L'intendant Pellione annonce chaque invité à voix haute. Premier test de posture : tenue, titre, escorte (Darn Fer-Vallée peut les faire entrer). Comment les PJ sont-ils perçus ?	A_FAIRE	0	2026-08-23 18:48:21.829	2026-09-06 14:23:31.187	f
779f2f55-5632-4e0f-8c59-bf688300a72d	e2a20feb-d330-473a-a487-e435b27f2cee	Discours d'accueil & toast d'Ordan	Daren Tovalis souhaite la bienvenue « à ceux qui bâtissent la ville de leurs mains ». Puis Ordan Tovalis porte un toast provocateur contre les Cilovard → premier froid public (fil du Port).	A_FAIRE	4	2026-08-23 18:48:21.829	2026-09-06 14:23:31.19	f
be1cfd23-2f16-4cc0-bd27-a1af56619a4b	e2a20feb-d330-473a-a487-e435b27f2cee	Le banquet	Le placement à table crée les opportunités : un PJ peut se retrouver près d'Ismara Cilovard, de Maerin Tovalis ou d'un contremaître bavard (Bord Amac éméché). Moment des confidences et des indiscrétions.	A_FAIRE	6	2026-08-23 18:48:21.829	2026-09-06 14:23:31.191	f
b77eb48d-4ae5-4254-8ea3-f788b71a8bf4	e2a20feb-d330-473a-a487-e435b27f2cee	Ouverture du bal (les danses)	Les danses commencent ; l'étiquette pousse les hôtes de marque à ouvrir un tour — occasion d'un tête-à-tête forcé (Selianne Palhindile ? Ismara Cilovard ?).	A_FAIRE	7	2026-08-23 18:48:21.829	2026-09-06 14:23:31.192	f
e5a17219-9bc3-4fbb-b385-2d37453a6e4e	e2a20feb-d330-473a-a487-e435b27f2cee	[Contact] Ismara Cilovard	Mal à l'aise, sincère ; bien traitée, elle devient une alliée et confirme l'existence du contrat Haldor (Port).	A_FAIRE	19	2026-08-23 18:48:21.829	2026-09-06 14:23:31.197	t
ed6add89-bbd3-4edc-8ef1-56540f68ed2d	e2a20feb-d330-473a-a487-e435b27f2cee	[Contact] Harl Denvar	Si on gagne sa confiance : son dossier « Les Yeux dans la pierre » et le salut codé « Rayon » (fil du Roi).	A_FAIRE	20	2026-08-23 18:48:21.829	2026-09-06 14:23:31.198	t
014a3e9e-df28-4418-a9b6-05f91ba8f85a	d56f6a33-a98e-4dd2-920e-211110b3dcf1	[Contact] Vittore Mastiggia	L'opposition. Charmeur puis menaçant : il propose, achète, intimide. Face à Ezbehar (qui l'a déjà chassé au Fretin), le vernis craque. Il ignore encore que les PJ détiennent la preuve de ses livraisons aux vampires.	A_FAIRE	9	2026-08-31 14:51:11.011	2026-08-31 14:51:11.011	t
906b9d00-6ba2-44af-bb52-ebc766c77752	d56f6a33-a98e-4dd2-920e-211110b3dcf1	[Contact] Lady Serenya Palhindile	La Chancelière. Son poids politique peut porter l'édit — mais elle joue serré, consciente que la Couronne n'aime pas qu'on touche à ce commerce. Bien manœuvrée, elle offre une tribune ; froissée, elle temporise.	A_FAIRE	10	2026-08-31 14:51:11.012	2026-08-31 14:51:11.012	t
cd43716c-7a54-479d-8797-9a960debd979	e2a20feb-d330-473a-a487-e435b27f2cee	[Contact] Bord Amac (ivre)	« Les barges tournent moins rond depuis que les gens en pourpre inspectent les cales la nuit » → convois nocturnes vers la Citadelle Rouge (Roi).	A_FAIRE	21	2026-08-23 18:48:21.829	2026-09-06 14:23:31.198	t
a5b2dea1-96d1-4ba2-a382-519c5ee6c680	e2a20feb-d330-473a-a487-e435b27f2cee	[Contact] Selianne Palhindile	Évoque sa loi d'abolition et le négociant dolomicien (Mastiggia) qui rôde de trop près (fil de l'Esclavage).	A_FAIRE	22	2026-08-23 18:48:21.829	2026-09-06 14:23:31.199	t
aac9b307-6d96-4e1a-b154-f5f921eec7df	d56f6a33-a98e-4dd2-920e-211110b3dcf1	La contre-offensive Mastiggia (Vittore)	Vittore Mastiggia ne reste pas les bras croisés : il promet des « contrats de main-d'œuvre » avantageux aux Tovalis, agite la menace économique auprès des Cilovard, et rappelle discrètement que la traite est légale ailleurs. En sous-main, le Chambellan Aldric Vorréal appuie son jeu sans jamais se mouiller. Laissé libre, il retourne un ou deux indécis. Affronté (ou si les PJ sortent la preuve du Fretin), la partie devient publique — et dangereuse.	A_FAIRE	5	2026-08-31 14:51:11.005	2026-08-31 14:51:11.005	f
728382e9-e6a1-4879-b7a6-294603be3b2d	d56f6a33-a98e-4dd2-920e-211110b3dcf1	Fin de nuit — l’état des voix	Bilan : combien de Maisons ont basculé POUR, combien CONTRE, combien restent indécises. Le MJ note l'élan de l'édit. Si Ezbehar a sorti la preuve au bon moment, les Mastiggia sont sur la défensive et le Soleil Pourpre en alerte. Cet état des voix se reporte sur le Soir 3 (et le futur vote au Conseil). La proposition est lancée : reste à la faire aboutir.	A_FAIRE	6	2026-08-31 14:51:11.006	2026-08-31 14:51:11.006	f
5c23ebe5-c748-42da-9797-32d788047a82	d56f6a33-a98e-4dd2-920e-211110b3dcf1	[Fil] Compagnie Rigart — Illevas (suite)	Continuation légère du fil du Soir 1. Les Cilovard sont présents : Illevas peut confirmer où l'on tient Eldric Rigart (geôles Cilovard, sur l'île) et affiner la piste du contrat Haldor — en jouant Ismara Cilovard ou en surprenant une conversation. Le sauvetage lui-même se prépare hors bal.	A_FAIRE	7	2026-08-31 14:51:11.007	2026-08-31 14:51:11.007	t
a00bea57-e2ac-4dd1-a997-09d5c5559720	d56f6a33-a98e-4dd2-920e-211110b3dcf1	[Contact] Selianne Palhindile	La championne de l'édit. Elle détaille sa loi, ce qu'elle craint (les Mastiggia, la tiédeur des grandes Maisons), et ce dont elle a besoin des PJ : des voix, et de quoi discréditer la traite. Alliée précieuse pour Ezbehar.	A_FAIRE	8	2026-08-31 14:51:11.009	2026-08-31 14:51:11.009	t
0cc33ef2-ff35-463e-9f14-30a4ccab61f1	d56f6a33-a98e-4dd2-920e-211110b3dcf1	[Contact] Chambellan Aldric Vorréal	L'ombre de la Couronne. Officiellement neutre (le Roi est « souffrant »), il glisse des mots qui refroidissent les ardeurs abolitionnistes. MJ : agent du Soleil Pourpre, il défend en secret le flux d'esclaves détourné vers les vampires — sortir la preuve du Fretin le met directement en alerte.	A_FAIRE	11	2026-08-31 14:51:11.013	2026-08-31 14:51:11.013	t
58de2b35-9449-45a5-97bf-b1be37267d4a	d56f6a33-a98e-4dd2-920e-211110b3dcf1	[Jeu] Joute d’éloquence — rallier une Maison indécise	Un débat de salon arbitré par les médiateurs de Selianne Palhindile. Persuasion ou Tromperie (DC 14, +2 avec un argument taillé pour l'interlocuteur : chiffré pour les Cilovard, social pour les Tovalis). Réussite = une Maison indécise bascule POUR ; échec critique = elle se braque CONTRE.	A_FAIRE	12	2026-08-31 14:51:11.014	2026-08-31 14:51:11.014	t
7115545c-8691-4e8e-a626-0b71153f4a77	e2a20feb-d330-473a-a487-e435b27f2cee	Fin de nuit — l'after	L'assistance se clairsème. Velric Tovalis propose l'« after » (paris, Arène du Goulet Écarlate) ; les langues se délient au balcon ; un agent de l'Œil Pourpre traîne dans les couloirs.	A_FAIRE	9	2026-08-23 18:48:21.829	2026-09-06 14:23:31.193	f
94912ca7-7151-432e-8b0a-ce1a28aa8d68	e2a20feb-d330-473a-a487-e435b27f2cee	Le tirage de l’urne — le plan de table	À l'entrée du banquet, une grande urne de marbre attend les convives : chacun y tire un jeton numéroté qui désigne sa place — donc son voisin de table. Faites tirer chaque PJ (jeton, ou 1d20) : il dîne aux côtés du convive portant ce numéro. Deux PJ peuvent partager la même tablée.\n\nCe qu'on glane selon le voisin (ordre tiré au sort) :\n\n1. Ismara Cilovard — sincère, rongée par un secret comptable de sa propre Maison ; confidente potentielle.\n2. Ordan Tovalis — grandiloquent ; renseigne sur qui est qui dans la salle.\n3. Lady Serenya Palhindile — Chancelière ; éclaire la politique d'Alagir — ses carnets de nuit trahissent, sans le savoir, les convois nocturnes vers la Citadelle Rouge.\n4. Vittore Mastiggia — onctueux ; propose des « contrats de main-d'œuvre » troubles (façade esclavagiste).\n5. Velric Tovalis — paris et combats illégaux ; porte d'entrée vers le milieu.\n6. Lord Calen Palhindile — vieux diplomate ; laisse entendre qu'il détient une correspondance compromettante de son temps d'ambassadeur.\n7. Garran Cilovard — guindé, sous une tension étrange ; un PJ perspicace sent le malaise (lien latent au Roi).\n8. Bord Amac — éméché, il se lâche : convois nocturnes vers la Citadelle Rouge, inspecteurs « en pourpre ».\n9. Selianne Palhindile — Cour des Ambassades ; carnet d'introductions, ouvre des portes.\n10. Daren Tovalis — hôte méfiant ; sa rancœur contre la Couronne perce sous la courtoisie.\n11. Chambellan Aldric Vorréal — langue de bois sur la « santé » du Roi ; un PJ attentif note qu'il observe et mémorise tout.\n12. Lorian Cilovard — commerce maritime ; contacts portuaires, contrebande possible.\n13. Sipha la Liseuse d'Ombres — diseuse du bal ; le voisinage vaut un présage gratuit (voir la péripétie dédiée).\n14. Maerin Tovalis — laisse filer que des barges sont réquisitionnées la nuit sur le fleuve.\n15. Lior Palhindile — nerveux ; laisse échapper l'existence d'une dalle gravée d'un plan des souterrains, sous son atelier.\n16. Lady Velena Cilovard — glaciale ; teste la valeur des PJ, évoque des registres « à l'encre rouge ».\n17. Harl Denvar — garde de Daren, vétéran du Soleil Pourpre ; peu bavard, mais ses silences en disent long.\n18. « Bœuf-de-Pierre » — colosse de fête jovial et bruyant ; défis de force à la clé (voir la péripétie dédiée).\n19. Merr Luth — nain honnête (Le Poids Juste) ; bon baromètre des prix et des rumeurs de marché.\n20. Derrik Holmar — contremaître des carrières Nord ; franc du collier, ragots d'atelier et griefs sociaux.	A_FAIRE	5	2026-08-31 08:41:35.937	2026-09-06 14:23:31.191	f
ad80ed93-95cb-4a4e-b8fe-8e48483f5453	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Dés & cartes des nobles	Escamotage / Intuition / Tromperie pour gagner (ou repérer un tricheur). Enjeu : de l'or, ou une dette morale d'un petit noble (faveur à encaisser).	A_FAIRE	12	2026-08-23 18:48:21.829	2026-09-06 14:23:31.194	t
11d4645e-4627-4043-8412-092bf155af72	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Ouvrir une danse	Représentation, Persuasion ou Acrobaties (DC 13). Bien danser avec Ismara ou Selianne débloque une confidence ; un faux pas = petit scandale amusant.	A_FAIRE	13	2026-08-23 18:48:21.829	2026-09-06 14:23:31.195	t
b72dc987-a349-4cb7-87b4-f5dc4b8a6dcd	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Le présage de Sipha la Liseuse d'Ombres	Contre une pièce, elle tire un présage joliment vague. Le MJ y glisse un indice voilé sur l'une des trois intrigues (Port / Esclavage / Roi).	A_FAIRE	14	2026-08-23 18:48:21.829	2026-09-06 14:23:31.195	t
83a2e5f0-e6a6-4250-82c0-1eee26452d20	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Joute d'éloquence	Un noble hautain provoque un PJ en duel verbal. Persuasion / Intimidation / Tromperie opposé — gagner impose le respect à la tablée.	A_FAIRE	15	2026-08-23 18:48:21.829	2026-09-06 14:23:31.195	t
76efe9ed-5e5e-477e-b3aa-fe107a9f7572	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Défi de boisson tovalis	L'alcool de contrebande de Bord Amac. Jet de Constitution en escalade — tenir délie SA langue (bonus RP) ; tomber = réveil compromettant.	A_FAIRE	16	2026-08-23 18:48:21.829	2026-09-06 14:23:31.196	t
ee59bee8-5833-48e9-a0a7-56115bf6f6f1	e2a20feb-d330-473a-a487-e435b27f2cee	[Jeu] Poudre de marbre	Dans un salon à l'écart, de jeunes nobles « prisent » le stimulant de Velric. Observer, refuser, ou s'en servir comme levier de chantage plus tard.	A_FAIRE	17	2026-08-23 18:48:21.829	2026-09-06 14:23:31.196	t
79423dc8-1114-451c-9dd9-fd78ac802399	e2a20feb-d330-473a-a487-e435b27f2cee	[Contact] Maerin Tovalis	Parle Huriya et affaires ; lâche que « Eldric n'a plus signé de sa main depuis des mois » (fil du Port).	A_FAIRE	18	2026-08-23 18:48:21.829	2026-09-06 14:23:31.197	t
ee5b61be-2121-49a8-a232-1efb042799d3	d56f6a33-a98e-4dd2-920e-211110b3dcf1	Arrivée & présentation	Deuxième bal de la Fête de la Fondation, chez les Palhindile, sous les grandes verrières du Palais des Ambassades. Après la robustesse tovalis, place au feutré diplomatique : lumière filtrée, musiciens elfes, protocole millimétré. Les médiateurs de Selianne Palhindile accueillent chaque délégation ; le ton, ce soir, est à la politique. On sent qu'une annonce se prépare.	A_FAIRE	0	2026-08-31 14:51:10.996	2026-08-31 14:51:10.996	f
28c9d428-02fc-4103-86c0-feb822a85812	d56f6a33-a98e-4dd2-920e-211110b3dcf1	Les invités — les camps en présence	Toutes les Maisons sont là, mais ce soir elles se jaugent en futurs votants. Repères pour le MJ :\n— Hôtes / porteurs de la loi : Lady Serenya Palhindile (Chancelière), Selianne Palhindile (qui présente l'édit), Lord Calen Palhindile, Lior Palhindile, Nimra.\n— Marchands concernés : Vittore Mastiggia (émissaire, farouchement contre), délégations dolomicienne et gandorenne (traite encore légale chez elles).\n— Indécis à courtiser : les Cilovard (Garran Cilovard calcule ; Ismara Cilovard peut pencher pour) et les Tovalis (Daren Tovalis et Maerin Tovalis craignent un précédent sur leurs 3 000 travailleurs).\n— L'ombre de la Couronne : le Chambellan Aldric Vorréal, tout sourire — mais l'abolition tarirait un flux qui arrange le Roi.	A_FAIRE	1	2026-08-31 14:51:10.998	2026-08-31 14:51:10.998	f
ab04135e-be6a-4ab5-aeb2-b270ed3f5c01	d56f6a33-a98e-4dd2-920e-211110b3dcf1	[Fil] Abolition de l’esclavage — Ezbehar	Fil porté par Ezbehar, en droite ligne du Bal Tovalis (Soir 1). C'est ici que se joue la proposition d'abolition.\nSon atout : depuis le Fretin, Ezbehar détient la preuve que les Mastiggia détournent des esclaves « traités » vers les vampires (contrat de livraison Mastiggia ↔ Nharivum — 6e chargement, 50 « unités »).\nCe qu'il peut faire ce soir :\n— Rallier les indécis (Cilovard, Tovalis) à la loi de Selianne Palhindile, Maison par Maison.\n— Choisir SON moment pour sortir la preuve contre les Mastiggia : bien placée, elle discrédite Vittore Mastiggia et fait basculer des voix ; mal placée, elle éveille le Soleil Pourpre (via le Chambellan Aldric Vorréal) et expose le fil vampire.\nSortie : l'état des voix en fin de nuit décide de l'élan de l'édit pour la suite (Soir 3 / Conseil).	A_FAIRE	2	2026-08-31 14:51:10.999	2026-08-31 14:51:10.999	f
85a1192d-2db9-4256-a078-d6f521e30cec	d56f6a33-a98e-4dd2-920e-211110b3dcf1	Le dévoilement de la loi (Selianne)	Au centre de la verrière, Selianne Palhindile présente, au nom de la Chancellerie, l'Édit d'Affranchissement : interdire la traite et la détention d'esclaves à Alagir, et faire pression sur les Dolomites et Gandorenne. Elle prévoit des compensations pour les maisons marchandes — de quoi séduire les indécis. Lady Serenya Palhindile appuie de tout son poids de Chancelière. La salle se fige : chacun mesure ce que ça lui coûte ou lui rapporte.	A_FAIRE	3	2026-08-31 14:51:11	2026-08-31 14:51:11	f
91b13931-b08b-4af5-a227-61c01e195624	d56f6a33-a98e-4dd2-920e-211110b3dcf1	Le débat d’abolition — pour, contre, indécis	Le cœur de la soirée. Les Maisons prennent position ; les PJ travaillent la salle.\n— POUR : Palhindile, courants réformistes, la voix (silencieuse) des affranchis.\n— CONTRE : Mastiggia (leur commerce même) et, en coulisse, la Couronne via le Soleil Pourpre.\n— INDÉCIS à convaincre : Cilovard (intérêt financier — Ismara Cilovard est une porte d'entrée), Tovalis (peur du précédent sur leur main-d'œuvre), délégations dolomicienne / gandorenne.\nJets utiles : Persuasion, Intuition, Tromperie ; un argument chiffré (compensations) ou moral (les affranchis) selon l'interlocuteur. Chaque Maison ralliée = une voix acquise pour la suite.	A_FAIRE	4	2026-08-31 14:51:11.001	2026-08-31 14:51:11.001	f
cad0f43a-71dd-4ec8-ad76-20359a69a028	e2a20feb-d330-473a-a487-e435b27f2cee	[Fil] Compagnie Rigart — Illevas	Fil porté par Illevas (protagoniste). Objectif du soir : donner suite à l'offre de Maître Ulric Brumel (cf. journal) — préparer la libération d'Eldric Rigart, retenu dans les geôles des Cilovard sur l'île, et mettre la main sur le contrat signé par Haldor qui a fait basculer 49 % de la compagnie (Rigart & fils / « Victus & fils »).\n\nCe que le bal permet de récolter :\n— Ismara Cilovard (voir sa péripétie de contact) : bien traitée, elle devient une alliée et confirme l'existence du contrat Haldor. Son propre secret comptable en fait un levier.\n— Maerin Tovalis : laisse entendre qu'« Eldric ne signe plus » — il est tenu sous contrainte.\n— Ordan Tovalis provoque en public : la tension Cilovard / Rigart s'affiche au grand jour.\n\nSortie de soirée : Illevas repart avec la localisation (geôles Cilovard, sur l'île) et la piste du contrat → prépare l'opération de sauvetage d'Eldric et de récupération du contrat de cession.	A_FAIRE	2	2026-08-31 14:14:23.77	2026-09-06 14:23:31.189	f
a9ded43b-c864-4bfa-830c-3663909f02be	e2a20feb-d330-473a-a487-e435b27f2cee	[Fil] Esclavagisme — Ezbehar	Fil porté par Ezbehar. Objectif du soir : reprendre la piste Mastiggia (il a déjà pris Vittore en chasse au Fretin) et sonder le terrain de l'abolition.\n\nCe que le bal permet de récolter :\n— Vittore Mastiggia, émissaire présent : sous ses dehors de marchand dolomicien, il propose des « contrats de main-d'œuvre » troubles. Face à Ezbehar, la rencontre est tendue — ils se connaissent déjà.\n— Selianne Palhindile (voir sa péripétie de contact) : évoque sa loi d'abolition et ce négociant dolomicien qui rôde de trop près.\n\nSortie de soirée : le fil de l'abolition est amorcé → il enchaîne directement sur le Bal Palhindile (Soir 2), où la proposition d'abolition de l'esclavage sera développée.	A_FAIRE	3	2026-08-31 14:14:23.781	2026-09-06 14:23:31.189	f
82ae1e39-d604-40d0-9317-e303746fe0ba	e2a20feb-d330-473a-a487-e435b27f2cee	Les invités du Bal — les trois Maisons	Toutes les grandes Maisons d'Alagir sont représentées au Palazzo Khaz'Kanoon. L'intendant Pellione annonce chaque entrée. Les PJ croiseront, au fil de la soirée :\n\nMaison Cilovard (finance / marchand)\n- Garran Cilovard — patriarche, courtois et guindé.\n- Lady Velena Cilovard — épouse, comptable glaciale.\n- Lorian Cilovard — fils aîné, commerce maritime.\n- Ismara Cilovard — fille cadette, la « conscience » de la famille.\n- Alliés : Merr Luth (nain, Le Poids Juste), Eldric Rigart (jeune héritier allié).\n\nMaison Tovalis (hôtes — carriers / fluvial)\n- Daren Tovalis — patriarche et hôte du bal.\n- Maerin Tovalis — héritière, transport fluvial.\n- Velric Tovalis — fils cadet, rebelle.\n- Ordan Tovalis — porte-parole, maître de cérémonie officieux.\n- Escorte / gardes : Darn Fer-Vallée (peut faire entrer les PJ), Harl Denvar, Cryta.\n- Contremaîtres conviés : Derrik Holmar, Jesa Tolvine, Bord Amac (déjà éméché), Tarn Vess.\n- Brynn Fer-Vallée — présente en marge, glissée par son frère Darn (naïve, peu à sa place).\n\nMaison Palhindile (diplomatie / elfique)\n- Lady Serenya Palhindile — matriarche, Chancelière d'Alagir.\n- Lord Calen Palhindile — époux, érudit voûté.\n- Selianne Palhindile — héritière, Cour des Ambassades.\n- Lior Palhindile — mage archiviste.\n- Nimra — elfe androgyne, La Verrière Fendue.\n\nInvités d'honneur\n- Chambellan Aldric Vorréal — envoyé de la Couronne pour excuser l'absence du Roi, dit souffrant. (MJ : œil du Soleil Pourpre.)\n- Vittore Mastiggia — émissaire de la maison Mastiggia (marchand dolomicien).\n- Lysanne Orfe — « courtière en obligations » : façade mondaine du Conseil d'Acier, venue rappeler leurs échéances aux trois Maisons.	A_FAIRE	1	2026-08-31 08:41:35.932	2026-09-06 14:23:31.188	f
f0b3cbc5-1a8f-4f73-b70f-4668b5830de4	e2a20feb-d330-473a-a487-e435b27f2cee	[Contact] Lysanne Orfe (Conseil d’Acier)	Courtière en obligations — façade mondaine du Conseil d'Acier. Elle circule de groupe en groupe et rappelle, avec des mots trop polis pour être une menace, que les échéances approchent.\n\nCe qu'elle laisse filtrer si on la met en confiance :\n— Tovalis doit le plus : des avances contractées sur l'exploitation des carrières.\n— Cilovard a emprunté pour couvrir un revers maritime — une dette moyenne, mais fraîche.\n— Chez les Palhindile, la somme est petite mais honteuse : un proche de la Chancelière a emprunté en secret.\n\nBien menée (Persuasion ou Tromperie), elle lâche quel folio du Grand Registre pèse sur quelle Maison — une monnaie d'échange redoutable dans la soirée. Brusquée, elle sourit, note, et passe à un autre groupe : on ne bouscule pas le Conseil d'Acier dans un salon.\n\nMJ : elle constitue en parallèle son propre dossier sur Rany Mullimax, le chef de la cellule d'Alagir.	A_FAIRE	23	2026-09-06 14:23:31.37	2026-09-06 14:23:31.37	t
e32e6fb8-51f3-4f78-8448-bef919c61be2	62e0cc6d-6c2b-4ea2-bf01-c849bd5231ff	Nouvelle classe Ezbehar	Même après le heal il reste inconscient\n\ncoté Ezbehar\nUne douleur aigüe qui déchire ton cerveaux en 2. Commence a ce frappé la tête pour que la douleur s’arrête des fragment de t'est partie brillante vole en éclat petit la douleur deviens insoutenables et au point de bascule du supportable à 2 doigts de tombé dans la folie. Tu trouve enfin comment arrêté cette douleur comme un point central ou tout converge. Veux tu aller à ce point ? Si non JdS Sagesse désavantage DD15. \n\n------------------------------------------------------------------------\n\nCoté des autres \nIl commence a raidir a ce convulser, les yeux dans le vague, le sol commence à frémir de la poussières commence a ce décollé du sol. Le corps de Ez commence a s’arc-bouter et à ce soulever. Des éclats de corne commence à s'effriter et un miroitement apparait autour de lui comme l'air chaud au dessus d'une route.Avec le temps, le miroitement prend de plus en plus de place. Une intense lumière d'un bleu foncée apparait depuis le corps d'Ezbehar et se propage vers le miroitement en montant en intensités\n\n------------------------------------------------------------------------\n\nEz \nUne envie irrépressible de rugir ce fait sentir. tu sent que c'est la seul solution pour te soulager. \noui ? Sinon JdS Sagesse désavantage DD17.\n\nSi échec explosion Psi qui inflige 6d8 de force	FAITE	10	2026-09-06 08:03:36.546	2026-09-07 19:15:21.386	f
\.


--
-- Data for Name: _CampaignPlayers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."_CampaignPlayers" ("A", "B") FROM stdin;
b53a0e0e-f892-40bc-add4-08714b7c88ce	67647120-404a-4ad4-84a8-716bda739c6d
b53a0e0e-f892-40bc-add4-08714b7c88ce	7d71bc29-ee85-415a-b2b3-3ad9dcb83706
b53a0e0e-f892-40bc-add4-08714b7c88ce	119caa2d-452f-4136-b964-1e4208ccd37a
e30a0303-cbac-4684-956a-a19ff6d1e761	7d71bc29-ee85-415a-b2b3-3ad9dcb83706
b53a0e0e-f892-40bc-add4-08714b7c88ce	2da178f3-02a1-4383-ad8a-826c25097092
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3f816ef0-9ffb-4fb5-8a13-76bb4256a0eb	d7d3a33fcc95f353fcc4211830de2ec46944fbb23dcf9e23cd5244e93ef9dbee	2025-12-21 16:04:52.166487+01	20251221150452_init	\N	\N	2025-12-21 16:04:52.151305+01	1
979dfbfc-1cbb-49c4-9031-a0fd1de12d0e	03aacbaeb1381b398955cc90b449c121bc9345644d0980a21ab74b4cedd9a244	2026-03-15 09:40:36.219437+01	20260313000000_add_is_for_dm	\N	\N	2026-03-15 09:40:36.204496+01	1
740549c5-3cd9-4bd0-8b80-b951bc99d761	0339f06624c9c7daf882a0cf68ae35ac804cc5917077b9ca2f25c8d9559e4abe	2025-12-24 11:19:35.310095+01	20250121120000_add_city_icon_url	\N	\N	2025-12-24 11:19:35.302434+01	1
e2706a9f-349b-4597-b591-3854eaa8220a	258ac73f273e2e05bdb9593789622c4af4c3cb2a0de899957ba359efbac79d8e	2025-12-24 14:15:12.724877+01	20250121130000_add_place_icon_url	\N	\N	2025-12-24 14:15:12.717745+01	1
12ba0fb1-c630-4d01-8cce-9e31dd99abe5	c9230b51519fab9313a182e07a3bbdf66e3b9784867bbe7dce231d552711ae5c	2025-12-28 12:50:43.993239+01	20250121140000_add_person_enums	\N	\N	2025-12-28 12:50:43.972406+01	1
4bc96f79-3b46-47d4-a198-a8169bd305c1	1d82c2e57493c17589289b859ff704d0f7506263d67f8d6e3206b4d1f93a7cdf	2026-03-15 21:29:14.068738+01	20260316000000_add_flag_entity	\N	\N	2026-03-15 21:29:14.059568+01	1
52bedebf-15c1-45f3-a066-84fdc206183a	4ac2e1ad15526a991dddfd710b0c1875a878f1740c7adc592db50f908df7f6c5	2026-01-15 21:43:23.099573+01	20250125000000_add_district_entity	\N	\N	2026-01-15 21:43:23.049392+01	1
68813713-090c-4ffc-9221-77e472bc638f	54862024e5eaa861ef3a21450833b0f372bafbd33ac2aa089414c53a6996e60e	2026-01-20 18:04:53.84632+01	20250126000000_update_district_fields	\N	\N	2026-01-20 18:04:53.826308+01	1
8cf346f2-89e6-4d3a-9e0f-bab1a6105c5c	7f9ed95ea414f1028d6c31e37a22ad64cc04599202c92708984f976c6420ab74	2026-01-20 18:09:07.742208+01	20250126010000_remove_district_position	\N	\N	2026-01-20 18:09:07.732526+01	1
d2667719-5d4d-4837-a948-887f80abb7d4	613a640532819a518498bc5ba12412193537bf507083927ff77afb32933e42cf	2026-03-20 17:45:36.274325+01	20260317000000_add_city_place_map	\N	\N	2026-03-20 17:45:36.260577+01	1
8e19ed44-5ebd-484b-93d9-5ed53fd843c8	dffe5037fdeefaa67129d1b33bb7fe86ff80a77b1e2ce7e3554f689e5f9ea4ab	2026-01-22 17:26:52.165423+01	20250127000000_add_organisation_entity	\N	\N	2026-01-22 17:26:52.127677+01	1
6f04ca09-956d-454f-921f-0e0ec83b0172	d7214e217606d9b9015957cebf2fa1b3c862cbc97203d3ce37ef7a4d017889b3	2026-01-28 17:16:37.913589+01	20250128000000_add_organisation_hierarchy	\N	\N	2026-01-28 17:16:37.889824+01	1
be58ffcb-34c3-42d2-b595-a312a6217c7c	e1799b3e14df28dcb74ed1a00c1d9317a20519bca1cfb41d0fdb7344ec72404f	2026-01-28 17:16:37.97033+01	20250128000001_add_organisation_kingdom	\N	\N	2026-01-28 17:16:37.914057+01	1
48d81c40-e10f-4652-80e8-edd2196eab28	cdaaf7b7e09e26e614199e6f3275ad4ae00166dddaf58f82bcd7dfd2074905cc	2026-03-21 22:50:41.289587+01	20260318000000_add_show_on_map_and_pv_ca	\N	\N	2026-03-21 22:50:41.270878+01	1
ac697da8-7750-4b10-ac42-4f8fca61577c	5bcef85b72400afb5c4bf5201e11dc3f9e6fb826098a84b6d1bd7c300b486583	2026-01-29 10:25:22.451412+01	20250128000002_add_organisation_type	\N	\N	2026-01-29 10:25:22.427917+01	1
ad8927e2-4f5f-4e4a-b776-6e0208dc2902	0da2c10c0cb5e7c0b47569313bb8635dda7aa6c3d0ff5c9453b5590a19ea0745	2026-02-23 22:24:55.566873+01	20250223000000_add_kingdom_color	\N	\N	2026-02-23 22:24:55.551827+01	1
5464b5f3-c6fa-47c4-9bdc-a20e5bac7847	0853f88ac5b0d8061c0c6fdaaa910b53e5f7f59cc39ef1b99d681adc3f92f657	2026-03-12 14:29:10.613419+01	20260312000000_add_lore_entity	\N	\N	2026-03-12 14:29:10.563659+01	1
9461df7d-2b0b-4806-8b2b-72bbdc98f434	aa956d566f109c7713560f72901cf116b2b6be20651f918778455cbc55bc45be	2026-03-27 09:20:16.051475+01	20260327000000_lore_tags_array	\N	\N	2026-03-27 09:20:16.016851+01	1
93650f65-c618-4ddd-8e7a-b2418aa95868	e81bf1621a0d0e9a1bba4f6cb86a74a5c6f0052e0c910ecbcf194604ecdfa303	2026-03-31 22:01:05.927568+02	20260327120000_organisation_membership	\N	\N	2026-03-31 22:01:05.90404+02	1
f6876f9c-9203-47bf-a577-581039ab62a2	ddd31b7199652d7cac2c324f67826c528c26fe1db9becf6889e1f0a96b6d01c0	2026-03-31 22:32:15.914368+02	20260327150000_membership_ccch_to_militaire	\N	\N	2026-03-31 22:32:15.9081+02	1
9b7c17b7-8b77-417c-81f9-b744ec83f130	ff3fcd6c784da36e4fb5fdd67dda6b08bd7d628dc00e6edb209e77c6b0b58b58	2026-05-21 16:42:22.379044+02	20260328120000_add_person_fp	\N	\N	2026-05-21 16:42:22.350296+02	1
0d2be25e-ecbe-470b-ae4b-a78d352ab637	2dd681d7a976f2ac8288daa80561cd878046be14bafb984e9adad43eed635236	2026-08-30 15:28:33.915915+02	20260830000000_kingdom_borders	\N	\N	2026-08-30 15:28:33.890402+02	1
9496629a-cf1d-41ec-b9fa-fc4397ae1428	6c115346426eb9fe1bbff48d07345927582dc185dba088beb082429249bcad7f	\N	20260530000000_lore_date_in_game_datetime	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260530000000_lore_date_in_game_datetime\n\nDatabase error code: 22008\n\nDatabase error:\nERROR: date out of range: -5000-01-01\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E22008), message: "date out of range: -5000-01-01", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("timestamp.c"), line: Some(587), routine: Some("make_timestamp_internal") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260530000000_lore_date_in_game_datetime"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260530000000_lore_date_in_game_datetime"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260	2026-05-30 23:39:56.169778+02	2026-05-30 23:37:58.159952+02	0
7ca46c91-ec6e-4af6-8086-b9b50aef4370	b29027c0af137a8ef118e094c831c3e1e549e9faa22c513ce304d058d6ab7768	2026-05-30 23:39:57.900097+02	20260530000000_lore_date_in_game_datetime	\N	\N	2026-05-30 23:39:57.858881+02	1
2803c4a7-5ae5-42aa-81b5-b5288af69cc1	0c6434a616dd1e210fbf15a4f9da7366e7a7922eedf162a1c8456fa32736f0a6	2026-08-20 18:32:40.031081+02	20260820000000_combat_queststep_campaign_players	\N	\N	2026-08-20 18:32:39.98173+02	1
4c141e0d-d7b8-4965-95bf-75a853c5385b	972a2b249d962ea031e9521bf535d7229d9e5a576d0ed7923a1f121390562757	2026-07-10 21:30:41.682786+02	20260710000000_add_gm_combat_quest_session	\N	\N	2026-07-10 21:30:41.648603+02	1
6eabda6d-93a8-4418-93a1-4127716a4e4e	5ddb8713615356681c87e8b73ec641d2b33e76282e1a3b1ef872e3af045fd63f	2026-08-13 17:27:24.761354+02	20260814000000_add_campaign_and_quest_steps	\N	\N	2026-08-13 17:27:24.723037+02	1
45b91e05-0840-4859-a540-8f60c9a05905	be6a8e96ed9ac15edd38a271eba6bb5dce8709c3e8e72a475837aa4b6ab72e36	2026-08-23 20:45:33.421517+02	20260822000000_queststep_optional	\N	\N	2026-08-23 20:45:33.404928+02	1
1c9a0010-51a2-4b4e-afee-cfe0121eb81d	85e9e684cb8d0aca23518d568c6287bf47454130165cd42f0648a144b76618ac	2026-08-22 13:59:08.676271+02	20260821000000_game_session_campaign	\N	\N	2026-08-22 13:59:08.659944+02	1
38e71c20-6957-49ee-9bb8-ad20d9f94a60	8df1c4f314a7b73c502c14eceede3d3e132a160a53303c59c2b8c8d519683fdc	2026-09-04 12:38:01.267386+02	20260904000000_family_tree	\N	\N	2026-09-04 12:38:01.21323+02	1
d71fd56a-11b3-449f-ae65-dcc1e926ca01	8e4eac1042b9ec6232ff3b444dc496d1133a359c4055781b4d9906ebe019ca00	2026-09-06 16:53:04.311264+02	20260906000000_orgchart_superior	\N	\N	2026-09-06 16:53:04.291604+02	1
5df9a727-2bbf-405f-a774-edd772117db6	ff624cbb6939ffbf0fdf09d05d4c14ee716a719f4a1f04c1ce7cb6b61d1cde80	2026-09-10 21:31:18.925297+02	20260910000000_position_cascade	\N	\N	2026-09-10 21:31:18.892636+02	1
\.


--
-- Name: Campaign Campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Campaign"
    ADD CONSTRAINT "Campaign_pkey" PRIMARY KEY (id);


--
-- Name: City City_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);


--
-- Name: Combat Combat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Combat"
    ADD CONSTRAINT "Combat_pkey" PRIMARY KEY (id);


--
-- Name: Combatant Combatant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Combatant"
    ADD CONSTRAINT "Combatant_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: District District_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."District"
    ADD CONSTRAINT "District_pkey" PRIMARY KEY (id);


--
-- Name: FamilyMember FamilyMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_pkey" PRIMARY KEY (id);


--
-- Name: GameSession GameSession_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GameSession"
    ADD CONSTRAINT "GameSession_pkey" PRIMARY KEY (id);


--
-- Name: Kingdom Kingdom_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Kingdom"
    ADD CONSTRAINT "Kingdom_pkey" PRIMARY KEY (id);


--
-- Name: LoreCity LoreCity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreCity"
    ADD CONSTRAINT "LoreCity_pkey" PRIMARY KEY (id);


--
-- Name: LoreKingdom LoreKingdom_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreKingdom"
    ADD CONSTRAINT "LoreKingdom_pkey" PRIMARY KEY (id);


--
-- Name: LoreOrganisation LoreOrganisation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreOrganisation"
    ADD CONSTRAINT "LoreOrganisation_pkey" PRIMARY KEY (id);


--
-- Name: LorePerson LorePerson_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LorePerson"
    ADD CONSTRAINT "LorePerson_pkey" PRIMARY KEY (id);


--
-- Name: LorePlace LorePlace_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LorePlace"
    ADD CONSTRAINT "LorePlace_pkey" PRIMARY KEY (id);


--
-- Name: Lore Lore_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Lore"
    ADD CONSTRAINT "Lore_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationCity OrganisationCity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationCity"
    ADD CONSTRAINT "OrganisationCity_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationKingdom OrganisationKingdom_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationKingdom"
    ADD CONSTRAINT "OrganisationKingdom_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationMember OrganisationMember_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationMember"
    ADD CONSTRAINT "OrganisationMember_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationPlace OrganisationPlace_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationPlace"
    ADD CONSTRAINT "OrganisationPlace_pkey" PRIMARY KEY (id);


--
-- Name: Organisation Organisation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Organisation"
    ADD CONSTRAINT "Organisation_pkey" PRIMARY KEY (id);


--
-- Name: PersonOfInterest PersonOfInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_pkey" PRIMARY KEY (id);


--
-- Name: Place Place_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_pkey" PRIMARY KEY (id);


--
-- Name: PlayerCharacterEquipmentItem PlayerCharacterEquipmentItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterEquipmentItem"
    ADD CONSTRAINT "PlayerCharacterEquipmentItem_pkey" PRIMARY KEY (id);


--
-- Name: PlayerCharacterSavingThrow PlayerCharacterSavingThrow_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterSavingThrow"
    ADD CONSTRAINT "PlayerCharacterSavingThrow_pkey" PRIMARY KEY (id);


--
-- Name: PlayerCharacterSkill PlayerCharacterSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterSkill"
    ADD CONSTRAINT "PlayerCharacterSkill_pkey" PRIMARY KEY (id);


--
-- Name: PlayerCharacterSpell PlayerCharacterSpell_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterSpell"
    ADD CONSTRAINT "PlayerCharacterSpell_pkey" PRIMARY KEY (id);


--
-- Name: PlayerCharacter PlayerCharacter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacter"
    ADD CONSTRAINT "PlayerCharacter_pkey" PRIMARY KEY (id);


--
-- Name: Position Position_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_pkey" PRIMARY KEY (id);


--
-- Name: QuestStep QuestStep_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestStep"
    ADD CONSTRAINT "QuestStep_pkey" PRIMARY KEY (id);


--
-- Name: Quest Quest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quest"
    ADD CONSTRAINT "Quest_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: FamilyMember_organisationId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FamilyMember_organisationId_idx" ON public."FamilyMember" USING btree ("organisationId");


--
-- Name: FamilyMember_personId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FamilyMember_personId_idx" ON public."FamilyMember" USING btree ("personId");


--
-- Name: FamilyMember_playerCharacterId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FamilyMember_playerCharacterId_idx" ON public."FamilyMember" USING btree ("playerCharacterId");


--
-- Name: FamilyMember_superiorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FamilyMember_superiorId_idx" ON public."FamilyMember" USING btree ("superiorId");


--
-- Name: LoreCity_loreId_cityId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LoreCity_loreId_cityId_key" ON public."LoreCity" USING btree ("loreId", "cityId");


--
-- Name: LoreKingdom_loreId_kingdomId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LoreKingdom_loreId_kingdomId_key" ON public."LoreKingdom" USING btree ("loreId", "kingdomId");


--
-- Name: LoreOrganisation_loreId_organisationId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LoreOrganisation_loreId_organisationId_key" ON public."LoreOrganisation" USING btree ("loreId", "organisationId");


--
-- Name: LorePerson_loreId_personId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LorePerson_loreId_personId_key" ON public."LorePerson" USING btree ("loreId", "personId");


--
-- Name: LorePlace_loreId_placeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LorePlace_loreId_placeId_key" ON public."LorePlace" USING btree ("loreId", "placeId");


--
-- Name: OrganisationCity_organisationId_cityId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "OrganisationCity_organisationId_cityId_key" ON public."OrganisationCity" USING btree ("organisationId", "cityId");


--
-- Name: OrganisationKingdom_organisationId_kingdomId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "OrganisationKingdom_organisationId_kingdomId_key" ON public."OrganisationKingdom" USING btree ("organisationId", "kingdomId");


--
-- Name: OrganisationMember_organisationId_personId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "OrganisationMember_organisationId_personId_key" ON public."OrganisationMember" USING btree ("organisationId", "personId");


--
-- Name: OrganisationPlace_organisationId_placeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "OrganisationPlace_organisationId_placeId_key" ON public."OrganisationPlace" USING btree ("organisationId", "placeId");


--
-- Name: Position_cityId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Position_cityId_key" ON public."Position" USING btree ("cityId");


--
-- Name: Position_kingdomId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Position_kingdomId_key" ON public."Position" USING btree ("kingdomId");


--
-- Name: Position_personOfInterestId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Position_personOfInterestId_key" ON public."Position" USING btree ("personOfInterestId");


--
-- Name: Position_placeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Position_placeId_key" ON public."Position" USING btree ("placeId");


--
-- Name: Position_playerCharacterId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Position_playerCharacterId_key" ON public."Position" USING btree ("playerCharacterId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _CampaignPlayers_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_CampaignPlayers_AB_unique" ON public."_CampaignPlayers" USING btree ("A", "B");


--
-- Name: _CampaignPlayers_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_CampaignPlayers_B_index" ON public."_CampaignPlayers" USING btree ("B");


--
-- Name: City City_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Combat Combat_questStepId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Combat"
    ADD CONSTRAINT "Combat_questStepId_fkey" FOREIGN KEY ("questStepId") REFERENCES public."QuestStep"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Combatant Combatant_combatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Combatant"
    ADD CONSTRAINT "Combatant_combatId_fkey" FOREIGN KEY ("combatId") REFERENCES public."Combat"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Combatant Combatant_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Combatant"
    ADD CONSTRAINT "Combatant_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Combatant Combatant_playerCharacterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Combatant"
    ADD CONSTRAINT "Combatant_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."District"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_personOfInterestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_personOfInterestId_fkey" FOREIGN KEY ("personOfInterestId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: District District_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."District"
    ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FamilyMember FamilyMember_fatherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES public."FamilyMember"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FamilyMember FamilyMember_motherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES public."FamilyMember"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FamilyMember FamilyMember_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FamilyMember FamilyMember_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FamilyMember FamilyMember_playerCharacterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FamilyMember FamilyMember_spouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_spouseId_fkey" FOREIGN KEY ("spouseId") REFERENCES public."FamilyMember"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FamilyMember FamilyMember_superiorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FamilyMember"
    ADD CONSTRAINT "FamilyMember_superiorId_fkey" FOREIGN KEY ("superiorId") REFERENCES public."FamilyMember"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GameSession GameSession_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GameSession"
    ADD CONSTRAINT "GameSession_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."Campaign"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LoreCity LoreCity_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreCity"
    ADD CONSTRAINT "LoreCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreCity LoreCity_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreCity"
    ADD CONSTRAINT "LoreCity_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreKingdom LoreKingdom_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreKingdom"
    ADD CONSTRAINT "LoreKingdom_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreKingdom LoreKingdom_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreKingdom"
    ADD CONSTRAINT "LoreKingdom_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreOrganisation LoreOrganisation_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreOrganisation"
    ADD CONSTRAINT "LoreOrganisation_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreOrganisation LoreOrganisation_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LoreOrganisation"
    ADD CONSTRAINT "LoreOrganisation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePerson LorePerson_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LorePerson"
    ADD CONSTRAINT "LorePerson_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePerson LorePerson_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LorePerson"
    ADD CONSTRAINT "LorePerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePlace LorePlace_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LorePlace"
    ADD CONSTRAINT "LorePlace_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePlace LorePlace_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LorePlace"
    ADD CONSTRAINT "LorePlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationCity OrganisationCity_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationCity"
    ADD CONSTRAINT "OrganisationCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationCity OrganisationCity_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationCity"
    ADD CONSTRAINT "OrganisationCity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationKingdom OrganisationKingdom_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationKingdom"
    ADD CONSTRAINT "OrganisationKingdom_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationKingdom OrganisationKingdom_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationKingdom"
    ADD CONSTRAINT "OrganisationKingdom_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationMember OrganisationMember_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationMember"
    ADD CONSTRAINT "OrganisationMember_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationMember OrganisationMember_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationMember"
    ADD CONSTRAINT "OrganisationMember_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationPlace OrganisationPlace_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationPlace"
    ADD CONSTRAINT "OrganisationPlace_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationPlace OrganisationPlace_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrganisationPlace"
    ADD CONSTRAINT "OrganisationPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Organisation Organisation_parentOrganisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Organisation"
    ADD CONSTRAINT "Organisation_parentOrganisationId_fkey" FOREIGN KEY ("parentOrganisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."District"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Place Place_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Place Place_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."District"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Place Place_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PlayerCharacterEquipmentItem PlayerCharacterEquipmentItem_playerCharacterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterEquipmentItem"
    ADD CONSTRAINT "PlayerCharacterEquipmentItem_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlayerCharacterSavingThrow PlayerCharacterSavingThrow_playerCharacterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterSavingThrow"
    ADD CONSTRAINT "PlayerCharacterSavingThrow_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlayerCharacterSkill PlayerCharacterSkill_playerCharacterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterSkill"
    ADD CONSTRAINT "PlayerCharacterSkill_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlayerCharacterSpell PlayerCharacterSpell_playerCharacterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacterSpell"
    ADD CONSTRAINT "PlayerCharacterSpell_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlayerCharacter PlayerCharacter_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacter"
    ADD CONSTRAINT "PlayerCharacter_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PlayerCharacter PlayerCharacter_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacter"
    ADD CONSTRAINT "PlayerCharacter_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."District"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PlayerCharacter PlayerCharacter_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacter"
    ADD CONSTRAINT "PlayerCharacter_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PlayerCharacter PlayerCharacter_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlayerCharacter"
    ADD CONSTRAINT "PlayerCharacter_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Position Position_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Position Position_personOfInterestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_personOfInterestId_fkey" FOREIGN KEY ("personOfInterestId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Position Position_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Position Position_playerCharacterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestStep QuestStep_questId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."QuestStep"
    ADD CONSTRAINT "QuestStep_questId_fkey" FOREIGN KEY ("questId") REFERENCES public."Quest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quest Quest_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Quest"
    ADD CONSTRAINT "Quest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."Campaign"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _CampaignPlayers _CampaignPlayers_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_CampaignPlayers"
    ADD CONSTRAINT "_CampaignPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES public."Campaign"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CampaignPlayers _CampaignPlayers_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_CampaignPlayers"
    ADD CONSTRAINT "_CampaignPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES public."PlayerCharacter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

