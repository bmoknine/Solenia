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

ALTER TABLE IF EXISTS ONLY public."Position" DROP CONSTRAINT IF EXISTS "Position_placeId_fkey";
ALTER TABLE IF EXISTS ONLY public."Position" DROP CONSTRAINT IF EXISTS "Position_personOfInterestId_fkey";
ALTER TABLE IF EXISTS ONLY public."Position" DROP CONSTRAINT IF EXISTS "Position_kingdomId_fkey";
ALTER TABLE IF EXISTS ONLY public."Position" DROP CONSTRAINT IF EXISTS "Position_cityId_fkey";
ALTER TABLE IF EXISTS ONLY public."Place" DROP CONSTRAINT IF EXISTS "Place_kingdomId_fkey";
ALTER TABLE IF EXISTS ONLY public."Place" DROP CONSTRAINT IF EXISTS "Place_districtId_fkey";
ALTER TABLE IF EXISTS ONLY public."Place" DROP CONSTRAINT IF EXISTS "Place_cityId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonOfInterest" DROP CONSTRAINT IF EXISTS "PersonOfInterest_placeId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonOfInterest" DROP CONSTRAINT IF EXISTS "PersonOfInterest_kingdomId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonOfInterest" DROP CONSTRAINT IF EXISTS "PersonOfInterest_districtId_fkey";
ALTER TABLE IF EXISTS ONLY public."PersonOfInterest" DROP CONSTRAINT IF EXISTS "PersonOfInterest_cityId_fkey";
ALTER TABLE IF EXISTS ONLY public."Organisation" DROP CONSTRAINT IF EXISTS "Organisation_parentOrganisationId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationPlace" DROP CONSTRAINT IF EXISTS "OrganisationPlace_placeId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationPlace" DROP CONSTRAINT IF EXISTS "OrganisationPlace_organisationId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationMember" DROP CONSTRAINT IF EXISTS "OrganisationMember_personId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationMember" DROP CONSTRAINT IF EXISTS "OrganisationMember_organisationId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationKingdom" DROP CONSTRAINT IF EXISTS "OrganisationKingdom_organisationId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationKingdom" DROP CONSTRAINT IF EXISTS "OrganisationKingdom_kingdomId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationCity" DROP CONSTRAINT IF EXISTS "OrganisationCity_organisationId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationCity" DROP CONSTRAINT IF EXISTS "OrganisationCity_cityId_fkey";
ALTER TABLE IF EXISTS ONLY public."LorePlace" DROP CONSTRAINT IF EXISTS "LorePlace_placeId_fkey";
ALTER TABLE IF EXISTS ONLY public."LorePlace" DROP CONSTRAINT IF EXISTS "LorePlace_loreId_fkey";
ALTER TABLE IF EXISTS ONLY public."LorePerson" DROP CONSTRAINT IF EXISTS "LorePerson_personId_fkey";
ALTER TABLE IF EXISTS ONLY public."LorePerson" DROP CONSTRAINT IF EXISTS "LorePerson_loreId_fkey";
ALTER TABLE IF EXISTS ONLY public."LoreOrganisation" DROP CONSTRAINT IF EXISTS "LoreOrganisation_organisationId_fkey";
ALTER TABLE IF EXISTS ONLY public."LoreOrganisation" DROP CONSTRAINT IF EXISTS "LoreOrganisation_loreId_fkey";
ALTER TABLE IF EXISTS ONLY public."LoreKingdom" DROP CONSTRAINT IF EXISTS "LoreKingdom_loreId_fkey";
ALTER TABLE IF EXISTS ONLY public."LoreKingdom" DROP CONSTRAINT IF EXISTS "LoreKingdom_kingdomId_fkey";
ALTER TABLE IF EXISTS ONLY public."LoreCity" DROP CONSTRAINT IF EXISTS "LoreCity_loreId_fkey";
ALTER TABLE IF EXISTS ONLY public."LoreCity" DROP CONSTRAINT IF EXISTS "LoreCity_cityId_fkey";
ALTER TABLE IF EXISTS ONLY public."District" DROP CONSTRAINT IF EXISTS "District_cityId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_placeId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_personOfInterestId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_kingdomId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_districtId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_cityId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."City" DROP CONSTRAINT IF EXISTS "City_kingdomId_fkey";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Position_placeId_key";
DROP INDEX IF EXISTS public."Position_personOfInterestId_key";
DROP INDEX IF EXISTS public."Position_kingdomId_key";
DROP INDEX IF EXISTS public."Position_cityId_key";
DROP INDEX IF EXISTS public."OrganisationPlace_organisationId_placeId_key";
DROP INDEX IF EXISTS public."OrganisationMember_organisationId_personId_key";
DROP INDEX IF EXISTS public."OrganisationKingdom_organisationId_kingdomId_key";
DROP INDEX IF EXISTS public."OrganisationCity_organisationId_cityId_key";
DROP INDEX IF EXISTS public."LorePlace_loreId_placeId_key";
DROP INDEX IF EXISTS public."LorePerson_loreId_personId_key";
DROP INDEX IF EXISTS public."LoreOrganisation_loreId_organisationId_key";
DROP INDEX IF EXISTS public."LoreKingdom_loreId_kingdomId_key";
DROP INDEX IF EXISTS public."LoreCity_loreId_cityId_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Position" DROP CONSTRAINT IF EXISTS "Position_pkey";
ALTER TABLE IF EXISTS ONLY public."Place" DROP CONSTRAINT IF EXISTS "Place_pkey";
ALTER TABLE IF EXISTS ONLY public."PersonOfInterest" DROP CONSTRAINT IF EXISTS "PersonOfInterest_pkey";
ALTER TABLE IF EXISTS ONLY public."Organisation" DROP CONSTRAINT IF EXISTS "Organisation_pkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationPlace" DROP CONSTRAINT IF EXISTS "OrganisationPlace_pkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationMember" DROP CONSTRAINT IF EXISTS "OrganisationMember_pkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationKingdom" DROP CONSTRAINT IF EXISTS "OrganisationKingdom_pkey";
ALTER TABLE IF EXISTS ONLY public."OrganisationCity" DROP CONSTRAINT IF EXISTS "OrganisationCity_pkey";
ALTER TABLE IF EXISTS ONLY public."Lore" DROP CONSTRAINT IF EXISTS "Lore_pkey";
ALTER TABLE IF EXISTS ONLY public."LorePlace" DROP CONSTRAINT IF EXISTS "LorePlace_pkey";
ALTER TABLE IF EXISTS ONLY public."LorePerson" DROP CONSTRAINT IF EXISTS "LorePerson_pkey";
ALTER TABLE IF EXISTS ONLY public."LoreOrganisation" DROP CONSTRAINT IF EXISTS "LoreOrganisation_pkey";
ALTER TABLE IF EXISTS ONLY public."LoreKingdom" DROP CONSTRAINT IF EXISTS "LoreKingdom_pkey";
ALTER TABLE IF EXISTS ONLY public."LoreCity" DROP CONSTRAINT IF EXISTS "LoreCity_pkey";
ALTER TABLE IF EXISTS ONLY public."Kingdom" DROP CONSTRAINT IF EXISTS "Kingdom_pkey";
ALTER TABLE IF EXISTS ONLY public."District" DROP CONSTRAINT IF EXISTS "District_pkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_pkey";
ALTER TABLE IF EXISTS ONLY public."City" DROP CONSTRAINT IF EXISTS "City_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Position";
DROP TABLE IF EXISTS public."Place";
DROP TABLE IF EXISTS public."PersonOfInterest";
DROP TABLE IF EXISTS public."OrganisationPlace";
DROP TABLE IF EXISTS public."OrganisationMember";
DROP TABLE IF EXISTS public."OrganisationKingdom";
DROP TABLE IF EXISTS public."OrganisationCity";
DROP TABLE IF EXISTS public."Organisation";
DROP TABLE IF EXISTS public."LorePlace";
DROP TABLE IF EXISTS public."LorePerson";
DROP TABLE IF EXISTS public."LoreOrganisation";
DROP TABLE IF EXISTS public."LoreKingdom";
DROP TABLE IF EXISTS public."LoreCity";
DROP TABLE IF EXISTS public."Lore";
DROP TABLE IF EXISTS public."Kingdom";
DROP TABLE IF EXISTS public."District";
DROP TABLE IF EXISTS public."Comment";
DROP TABLE IF EXISTS public."City";
DROP TYPE IF EXISTS public."UserType";
DROP TYPE IF EXISTS public."Sex";
DROP TYPE IF EXISTS public."OrganisationType";
DROP TYPE IF EXISTS public."Membership";
DROP TYPE IF EXISTS public."Language";
DROP TYPE IF EXISTS public."Breed";
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
    'PRINCIPAL'
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
    flag text
);


--
-- Name: Lore; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Lore" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "dateInGame" integer,
    summary text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
    languages public."Language"[] DEFAULT ARRAY[]::public."Language"[],
    "districtId" text,
    "isForDM" boolean DEFAULT false NOT NULL,
    ca integer,
    pv integer,
    "showOnMap" boolean DEFAULT true NOT NULL
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
    "showOnMap" boolean DEFAULT true NOT NULL
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
    "personOfInterestId" text
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
-- Data for Name: City; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."City" (id, name, description, "kingdomId", "iconUrl", "isForDM", flag, map) FROM stdin;
f4722f65-bb3e-400d-b818-260db1011f3a	Bag	Bag	\N	/Icon/village.png	f	\N	\N
c136e1cc-0f84-4729-b3e2-8dee3e6d46e1	Olcario	Olcario	\N	/Icon/fortified-city.png	f	\N	\N
b6d0fb34-df10-41f9-ab7a-585402919c03	Damor	Damor	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
da0f5b30-743d-422a-b281-9d276681f56f	Vonbadur	Vonbadur	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f	\N	\N
ec01895d-64a4-4687-8f2d-035f149904ed	Dugh Maral	Dugh Maral	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/capital.png	f	\N	\N
19df6e53-8868-4511-8a58-39c9e3659c21	Khairn Ladim	Kairn Ladim	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f	\N	\N
bdb2dcea-441e-4a99-9f75-200d554d88f6	Khairn Baduhr	Khairn Baduhr	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f	\N	\N
4de27113-8487-455c-ab37-d740d69d5619	Nollodrin	Nollodrin	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
2859a2c9-8ccc-4de5-a74e-4b8be15bb838	Orfani	Orfani	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f	\N	\N
19e896ae-0b41-46ed-923f-825f43215b53	Doxato	Doxato	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f	\N	\N
7f0198e3-b293-4d8c-a7ed-0bd1b9120e17	Port des Abymes	Port des Abymes	\N	/Icon/fortified-city.png	f	\N	\N
0ff4ed2b-4048-4ce9-9ec3-1c617727895c	Bakata	Bakata	\N	/Icon/fortified-city.png	f	\N	\N
bb93ab0c-8f81-430e-ac0b-16800b113e0e	Raine	Raine	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
899e1c2a-a99b-4eef-8e00-5657476b4a27	Amblon	Amblon	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/village.png	f	\N	\N
7ccf7b24-0e5e-42e5-8493-76ee231c25ac	Gandor	Gandor	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/capital.png	f	\N	\N
295580b8-9df6-4209-9d2a-1d237144a69c	Sillenor	Sillenor	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/village.png	f	\N	\N
96745fc0-6d7e-421c-a0a8-3bbb12b8f4c9	Jima	Jima	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/village.png	f	\N	\N
3cd0ba8b-db9c-4cbe-83e9-49a515399cbb	Phara	Phara	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/city.png	f	\N	\N
157a72f3-cc46-4430-8e4f-9ab0fefcf133	Vesa	Vesa	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
b508926d-83a0-4372-92d7-2363aeade1f4	Flosse	Flosse	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f	\N	\N
16e1a8a5-bbef-4927-b769-733a5cc63521	Brodnica	Brodnica	4d37eed1-161e-4156-970c-381793c3d614	/Icon/capital.png	f	\N	\N
e46962cc-2d61-423b-b3b8-e7466ffcd976	Morag	Morag	4d37eed1-161e-4156-970c-381793c3d614	/Icon/village.png	f	\N	\N
ce4ce8b9-77fd-4105-a0fb-ee5edb557a7c	Orneta	Orneta	4d37eed1-161e-4156-970c-381793c3d614	/Icon/village.png	f	\N	\N
443543db-314f-472e-a899-3d42f34fdb5f	Karni	Karni	4d37eed1-161e-4156-970c-381793c3d614	/Icon/fortified-city.png	f	\N	\N
e270ac1d-4df4-4af9-bb2c-ed96865d3b12	Velmira	capital elfe	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/capital.png	f	\N	\N
d5c6a0ac-1cb8-47cb-b0fc-aa17fefc587e	Asyn	Asyn	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f	\N	\N
9c44080d-9577-4c58-9a2f-4b8111c491d2	Oserinne	Oserinne	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f	\N	\N
94a2fd1d-9a42-4b60-ba6e-865208b430c1	Kelrion	Kelrion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/fortified-city.png	f	\N	\N
181d1980-2ade-4c0d-bf44-4252e636dc6c	Irnael	Irnael	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f	\N	\N
5d0cc51f-c6ac-4036-ad03-7344efecb965	Erilion	Erilion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f	\N	\N
2580fe9d-e8a1-46f1-83c1-d33b26ed6863	A'salion	A'salion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/capital.png	f	\N	\N
3777dab0-1e36-491c-859a-fdc48062201b	Örvat	Örvat	\N	/Icon/fortified-city.png	f	\N	\N
752d5094-7102-4a38-926a-cb814de89e27	Åsel	Åsel	\N	/Icon/village.png	f	\N	\N
6c33f828-7b6b-4890-95ce-0822caa1e807	Phosi	Phosi	\N	/Icon/village.png	f	\N	\N
ce3fb962-bb73-47f4-8e12-656c0af3f4a1	Mongar	Mongar	\N	/Icon/fortified-city.png	f	\N	\N
a602cacc-0d51-4334-a9e9-b54a7d60ac24	Anol	Anol	\N	/Icon/fortified-city.png	f	\N	\N
47119f73-bd40-4a59-b1c4-b8daf1b0eade	Haneti	Haneti	\N	/Icon/fortified-city.png	f	\N	\N
6b642f1f-70b8-4b37-ba14-9e3922efe3a8	Kashari	Kashari	\N	/Icon/fortified-city.png	f	\N	\N
6d39b2bc-6488-4763-9643-b57e9af59c03	Alagir	Alagir	\N	/Icon/city.png	f	\N	\N
f410d0e6-ae0b-47b9-92d0-a91e1a0e65a0	Mahate	Mahate	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
c1e27b23-4188-4fdd-96df-9d9dba88833b	Madja	Madja	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f	\N	\N
1ab001f3-e7d0-4cb2-a0ff-c6800549dc8d	Aya-Toumin	Aya-Toumin	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f	\N	\N
ac1ff1a0-087e-4400-8ce6-91337e238d24	Sulayman	Sulayman	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/city.png	f	\N	\N
b35688a0-96ed-4416-82b9-19db566f7815	Sandarane	Sandarane	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/capital.png	f	\N	\N
aef53759-d6b9-4bca-bc2b-7aca5ffb2676	Gizab	Gizab	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f	\N	\N
3c5962f4-339b-433a-b253-135a32db63f1	Nyala	Nyala	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f	\N	\N
d11ea82c-fc71-44f1-8d14-5ae423a31f83	Alkwariz-mi	Alkwariz-mi	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
cfda6692-0df6-400e-b9df-6786da0f1d92	Shur-Abak	Shur-Abak	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
42220881-20fd-4bc5-a818-d00cd79473b7	Al-Kurfrah	Al-Kurfrah	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
b220665e-2800-44ce-84e0-b0f9313640ed	Zametan	Zametan	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f	\N	\N
7c205d43-f91b-46f1-8809-7e774090823f	Raoued	Raoued	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f	\N	\N
f9f210bd-a735-4acc-a72e-701aea69750b	Iserna	Iserna	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	Russolio	Russolio	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
fd428152-24ae-4cf5-8239-ad928df9f930	Raino	Raino	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/village.png	f	\N	\N
72589e8c-bbbe-43fe-bb68-c7be7fbe0347	Stiffe	Stiffe	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/village.png	f	\N	\N
8d5a0617-0e82-4a8a-855f-582c1003805f	Calteri	Calteri	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/capital.png	f	\N	\N
42044469-437c-43d5-b1e3-41c4c6b18035	Arrezo	Arrezo	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
d52e5905-28b3-427a-b3ed-82a0d5646a9c	Volturo	Volturo	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f	\N	\N
d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	Momoritania	Momoritania	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/capital.png	f	\N	\N
388f3dfc-a23b-4cb4-8a38-4f15e36cdca6	Gomati	Gomati	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f	\N	\N
2c8c2982-7dfa-4be4-96e9-328c05473197	Vara	Vara	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
d182b816-ac9f-4f81-afb7-44c7bff6178f	Kalanos	Kalanos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f	\N	\N
e2d54173-58fe-4417-b763-e90fca60fd31	Xanthi	Xanthi	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
fce0576a-07d3-436d-a1be-2f7ea9ad34f2	Almiros	Almiros	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/city.png	f	\N	\N
4f2eca99-0e4a-4039-a211-9509758b8de3	Naxos	Naxos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f	\N	\N
3c456778-4811-4c35-8504-6af9803f8c5e	Dioni	Dioni	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f	\N	\N
7e2bddb2-6fc1-4d3e-8f50-95a6d241f012	Kelos	Kelos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
264a9f82-fdc3-4667-bd60-439a2a89ab04	Thiva	Thiva	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f	\N	\N
57171985-dade-4fcc-a00b-c06de058c7d6	Huriya	Cité libre située entre un fleuve(artère azure) et une chaîne de montagne(les Monts Affamés), elle est enclavée entre le royaume de Gandorenne et le Saint-empire Momoritanien de compte ~22000 âmes(bat. 3532) ça renommé à était faite grâce à la frappe de monnaie pour les 2 empires contigu. Elle est aussi connue car elle contient le Palais des Ententes.\nArchitecturalement, la ville attire l’attention par ses murs formé par les épées des mort des empire et son arche en or. Ses rues sont assez étroites et sinueuses. Les bâtiments sont souvent des petites échoppes construites en pierre au rez-de-chaussée suivie d’un ou ou plusieur étage en bois avec pour les plus aisé des murs recouvert de chaux.\nLa sécurité de la ville est maintenue par une Cohorte de mercenaire appelé les écu d’or. Elle connue pour excellé dans l'entraînement de ces recrues.	\N	/Icon/city.png	f	/flag/Huriya.png	/map/Huriya.png
55787c45-48b6-441b-b551-1ef3c3825a08	Alagir	Population approximative : 31 000 habitants.\n\nCité Pourpre ; marbre pourpre ; Couronne de Platine ; Roi Pelfort Vanguard.	4226ee30-e8a9-4817-910c-47baff2a7f2b	\N	f	\N	\N
d8c2ee3e-f123-4338-872f-72ada526811e	Huriya	Population approximative : 22 000 habitants.\n\nFrappe de monnaie ; Palais des Ententes ; famille Ivelis ; Écus d'or.	4226ee30-e8a9-4817-910c-47baff2a7f2b	\N	f	\N	\N
c867f929-58f0-4918-98b4-f6eab7e78bfa	Brodnica	Population approximative : 21 000 habitants.\n\nCapitale fluviale ; clans Itsasoa, Mendia, Elurra, Gerlaria.	93bae9c3-0145-4431-968d-96534b04b8f3	\N	f	\N	\N
38d0ef3b-0d8c-4183-9cdb-31f581417912	Morag	Population approximative : 2 100 habitants.	93bae9c3-0145-4431-968d-96534b04b8f3	\N	f	\N	\N
345e2587-3d67-4f9c-9c4c-1d7b5d3d74dc	Orneta	Population approximative : 6 300 habitants.	93bae9c3-0145-4431-968d-96534b04b8f3	\N	f	\N	\N
ac8e7c66-c368-4c05-a15a-f6faa41647f8	Karni	Population approximative : 6 500 habitants.\n\nMaire Sheli doxe ; école d'enchantement (doc partiellement mélangé avec Iserna des Dolomites).	93bae9c3-0145-4431-968d-96534b04b8f3	\N	f	\N	\N
01f8abc4-895e-441c-8367-7d55b4fa546e	Calteri	Population approximative : 17 000 habitants.\n\nCapitale ; école d'évocation.	ac22e46a-65f4-440b-a76a-48078bae1167	\N	f	\N	\N
9e59dd6a-63f0-4c65-b1bd-74316add8554	Arrezo	Population approximative : 11 000 habitants.\n\nTransmutation.	ac22e46a-65f4-440b-a76a-48078bae1167	\N	f	\N	\N
61d81c3b-e25f-43ab-8693-dc18599d41a5	Stiffe	Population approximative : 2 600 habitants.\n\nDivination.	ac22e46a-65f4-440b-a76a-48078bae1167	\N	f	\N	\N
e79e83d8-8e67-4511-a3f0-14911ea12b93	Raino	Population approximative : 1 800 habitants.\n\nIllusion ; QG Syndicat.	ac22e46a-65f4-440b-a76a-48078bae1167	\N	f	\N	\N
3df2a5ac-e15a-45d9-a1fd-cd755b855bb0	Russolio	Population approximative : 4 700 habitants.\n\nInvocation ; esclavage drakéide ; archimage Qualen Pilwicken.	ac22e46a-65f4-440b-a76a-48078bae1167	\N	f	\N	\N
0a437c59-0b07-4f1b-a78c-0bc45903255c	Volturno	Population approximative : 13 000 habitants.\n\nAbjuration (doc : 'Volturo' = coquille probable).	ac22e46a-65f4-440b-a76a-48078bae1167	\N	f	\N	\N
e6538773-eeba-4fd0-90b9-e3597c9738ed	Iserna	Population approximative : 1 800 habitants.\n\nEnchantement ; archimage Symma Turen ; Temple Noir.	ac22e46a-65f4-440b-a76a-48078bae1167	\N	f	\N	\N
25a44add-ea05-4b61-9af6-314953adeeb9	Dugh Maral	Capitale.	b602f1e4-44f6-4027-ad29-ecbaf335ad04	\N	f	\N	\N
3ddfd49b-c1cd-4849-9f42-b537a7c35de9	Kairn Ladim	\N	b602f1e4-44f6-4027-ad29-ecbaf335ad04	\N	f	\N	\N
48643390-7b5c-4b20-899b-49448ca4cd5c	Nollodir	\N	b602f1e4-44f6-4027-ad29-ecbaf335ad04	\N	f	\N	\N
e9d3c3b3-97f6-4152-93dd-0b4a4d14955e	Vonladur	\N	b602f1e4-44f6-4027-ad29-ecbaf335ad04	\N	f	\N	\N
71db8358-213f-4360-ac6d-94ea8987a9ef	Damor	\N	b602f1e4-44f6-4027-ad29-ecbaf335ad04	\N	f	\N	\N
4cefd825-d4f5-4b90-aa6e-74a6247cffac	Khairn Baduhr	\N	b602f1e4-44f6-4027-ad29-ecbaf335ad04	\N	f	\N	\N
b9aaf7c3-1375-48c6-a173-4682f8876e26	Velmira	Capitale.	75f06457-7f1b-4886-9dbd-a59105b4aee1	\N	f	\N	\N
2a22b7b0-076d-4d4c-a100-cd2bfa857dd0	Asyn	\N	75f06457-7f1b-4886-9dbd-a59105b4aee1	\N	f	\N	\N
3fe0c815-8eb1-4f82-8db3-165e37b1dbdd	Oserinne	\N	75f06457-7f1b-4886-9dbd-a59105b4aee1	\N	f	\N	\N
58077551-cfea-4123-acc8-5dd7517275bc	Kelrion	\N	75f06457-7f1b-4886-9dbd-a59105b4aee1	\N	f	\N	\N
dac32b28-1781-486c-8469-46e3c364a004	Irnael	\N	75f06457-7f1b-4886-9dbd-a59105b4aee1	\N	f	\N	\N
d59dda11-7ce8-4031-8f70-644b6b780245	Erilion	\N	75f06457-7f1b-4886-9dbd-a59105b4aee1	\N	f	\N	\N
db059ee1-07e0-4d60-8844-7ac6c4050e43	A'salion	\N	75f06457-7f1b-4886-9dbd-a59105b4aee1	\N	f	\N	\N
2e83140f-4098-47f5-9bb5-c5aef481b976	Gandor	Capitale ; David IV.	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
fd20a109-19f1-491a-8650-1cf92bf1795f	Phosi	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
d725e63f-e000-41c4-b094-2037ef43346d	Fiton	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
836a0bef-48a5-48cb-b12f-6f19ad92ebde	Vesa	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
babd4a5c-ec45-4e18-893e-e1d369750b81	Raine	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
15b2ad02-9900-4906-9a48-d7c2e31b0107	Banbus	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
379c1267-937a-4cc0-9016-9553f0dd55fe	Flose	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
3cf770fe-8e38-49cb-a528-949d3979f562	Phar	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
f4497c3e-4195-43c0-ac4b-f40e26c4abb8	Olcario	\N	b7e4c389-c493-496f-b0d8-6245e5a940ea	\N	f	\N	\N
a52c50ca-10f3-493f-877b-13fc5f989fda	Momoritania	Capitale impériale.	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
01af9040-ff8a-4008-8f68-e07b4f079b86	Gomati	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
a25de819-1399-4418-8f44-fcda6ac90367	Vara	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
1df26d38-8d4f-446e-b496-0152fcfa0a1e	Orfani	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
61055654-0579-4a5b-9e2c-eed4452c7922	Kalanos	Population approximative : 9 000 habitants.\n\nArdoise blanche ; ruines souterraines ; famille Elvaltis.	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
78ab849f-9e43-4b4e-be75-daa132dd39ae	Xanthi	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
42012719-5b13-43e8-974e-9c4280dbb081	Lofari	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
01ff1ffc-e2f4-490e-bae8-0c9d103ec894	Dioni	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
dc47afc7-2e26-4a73-891a-72006a97a9a5	Naxos	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
208a39d2-1f2d-40ec-af53-9fc350540e54	Kelos	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
b7875994-6b15-4563-ad52-edfb5fcded6d	Thiva	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
7e31daa9-5517-450d-87e2-905ffca2870c	Almiros	\N	0853ab51-158a-4719-90c4-f705eb4f2b7f	\N	f	\N	\N
5ea76c42-f49b-4b66-8d6e-bf914ef8018d	Sandarane	Capitale ; Mille cascades ; famille Alym.	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
64c83421-e0f7-402b-a298-eeeed447def5	Mahat	Cité-forteresse ; caravanes.	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
06d107b9-4220-4b2a-98de-bd464a6a4bfc	Sulayman	La magnifique.	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
69b9c52b-e53e-4ca3-a1e5-0b73d5f8da22	Alkwariz-mi	\N	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
083f67c2-ebfd-4ad0-a953-a75a9465496b	Aya-Toumin	Monastère Searinne.	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
514a8e9e-f500-47d8-be3b-bbe4ab0cc002	Nyala	Agriculture.	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
36b48cdb-0d87-43f2-851e-35824afc8af0	Gizab	\N	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
54e78b9b-f22b-4bc0-95fe-11c3c1b634b1	Shur-Abak	\N	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
141f97cb-2560-4b8a-964e-dccdb42c2670	Zametan	Perles.	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
c47e9fbc-e551-47be-8978-58b93824c8e7	Al-Kurfrah	\N	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
9831cf60-f0a9-4fc1-bfdc-10b2b6cebcf8	Madja	\N	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
e5d7e5f3-5947-4339-a665-ad908ccddb71	Raoued	Chantiers navals.	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	f	\N	\N
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
\.


--
-- Data for Name: Kingdom; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Kingdom" (id, name, population, description, "dateInGame", color, "isForDM", flag) FROM stdin;
e44df0a6-ffda-4e97-8f8b-bd34440f07b4	Le Royaume d'Alberan	300000	Le Royaume d'Alberan est coupé en 2 par une guerre civile au nord les elfes des neiges qui veulent étendre les glaces et au Sud les elfes qui reboisent la région.	0293-09-10 23:50:39	#21a207	f	/flag/Le_Royaume_D'Alberan.png
929e6be3-224f-4d25-8ea4-8a9d19aa8a02	La Reinaume de la mère de pierre	150000	La Reinaume de la mère de pierre	0191-06-01 23:50:39	#e99d1c	f	/flag/Le_Reinaume_De_La_Mère_De_Pierre.png
4d37eed1-161e-4156-970c-381793c3d614	Dominion de L'Antre	75000	Histoire :\nNation majoritairement drakonien elle fut vassalisée par les duchés Dolomite après que les grands dragons chromatiques se soient retirés des affaires des mortels. \nLe Grand blocus maritime de l’an 1006 à fait céder l’Antre.\nEconomie :\nComment le système économique fonctionne ?\n\tExport de minerai avec les duché, les cités libres et Gandorennes.\nQuelles sont les ressources les plus précieuses ?\n\tLe Fer-dragon\nComment les ressources sont vendues ?\n\tLe Fer-dragon, le cuivre, le fer, quelques peau d'animaux\nQuelles sont les régions les plus riches ?\n\tL’Est/Sud-Est\nReligion :\n\ndieux/déesses des religions du monde ?\nTiamat le dieu dragon\nMyths and Legends ?\n\tUn jour drakonien réveillera Tiamat de sa torpeur et unira les dragon\nPrincipaux idéal ou principes ?\n\tL’orgueil \nPossible tentions entre les religions ? guerre ?\n\tTension entre les religions et le culte de Tiamat\nMagie :\nQuasiment que des ensorceleurs avec une “école” pour les former.\nExecutive :\nSystème des gouvernements ? \nUne royauté.\nQui à le pouvoir ? et comment il s’échange ?\nLe Roi Tonur 17eme du nom. Le pouvoir se transmet de père en fils et il prend le nom de Tonur.\nComment les lois sont gérées ?\nPar décret royal. \nQui gère l'application de la loi ? \nLe maire des villes, les chevaliers et miliciens.\nTopologie : \nZone géographique remarquable ?\n\tChaîne de montagne (les crocs du dragon)\nComment les ressources naturelles sont-elles disponibles ?\n\tLa Chasse, le minage et raffinement (pour le Fer-Dragon)\nComment la géolocalisation influe-t-elle sur la survie des cultures ? \n\tInsulaire donc ils vivent donc quasiment en auto suffisance.\nInhabitant :\nCombien de races intelligentes vivent dans le monde ? Comment interagissent- elles entre elles ?\nToutes mais peu de Gnome car mal vu après la vassalisation.\nCulture :\nQuelle est la fonctionnalité ou différence entre les cultures ?\n\tUn peuple très uni assez méfiant des étrangers.\nChef d'œuvre dans l’arts / littérature / architecture  ?\n\tLe sanctuaire au dragon taillé à même dans la montagne \nQuel conflit il y a dans votre société ?  de gros conflits  ? récurrent ?\n\tPas mal de tension entre Drakonien/Gnome \nQuels effets ces conflits ont sur le monde ?\n\tBeaucoups de rixe/raquette ciblé en les 2 races \nSociété :\nQuelles sont les races les plus importantes  ?\nLes Drakonien/Gnome.\nQui sont les moins ?\nLes autres.\nComment elle coexiste ensemble ?\nMal tension entre Drakonien/Gnome	0104-05-21 23:50:39	#e9631c	f	/flag/Le_Dominion_De_L'Antre.png
6d9412ba-0f6d-41d5-b7b4-13e6549a990d	Le Sultanat de Sandarane	225000	Ce pays situé dans le sud-est de Solenia serait d'après les légendes le premier royaume à avoir été fondé. C'est un pays monarchique gouverné par la famille Alym depuis plus de 400 ans. La population y est majoritairement humaine bien que de moins en moins dû à son ouverture sur le monde. Bien qu'on ne se l'explique pas, les personnes qui en sont originaires ou vécus assez longtemps ont pour spécificité de donner toujours naissance à des jumeaux. Certaines hypothèses avancent qu'il s'agirait d'un élément dans l'air qui modifierait les personnes. D'autres qu'une malédiction ou bénédiction (suivant les point de vue) des dieux à était lancé sur le premier royaume de Solénia à relever de "la longue nuit".\n\nCa géographie quand à elle la coupe en 4 régions : \n\nLa première que l'ont appel "Alfaragh Al'abyad" ou le Vide Blanc, démarre depuis isthme Aljisr qui relie le continent au royaume et s'étend jusqu'au grand fleuve Alhayaa que l'on peu traduire en "La Vie". Elle contint des dunes blanches à perte de vue que seul une poignée de hameau ou de ville vienne interrompre. On y retrouve Mahat la cité forteresse ou transite l'entièreté des caravane marchande entrant dans le pays. Aya-Toumin petite ville nichée au cœur des dunes connue sont monastère dédié à Searinne Dieu de la Lumière et des Ombres et enfin Sulayman dite "la magnifique" deuxième plus grande cité du royaume point central dans l'échange de marchandise.\n\nLa seconde région appelée "Alqalb Akhdar" ou "le Cœur Vert" représente tout le nord du pays. Elle est caractérisée par des plaines verdoyantes et des jungle luxuriante. C'est là que se trouve Sandarane la capitale éponyme appelée aussi la cité au mille cascades de part son système d'irrigation si particulier. C'est là que se trouve le siège du pouvoir ou Moite le juste règne actuellement. Plus au sud se trouve Nyala ville exclusivement orienté vers l'agriculture, elle produit est stockée la majeure partie de la nourriture du pays. Encore au sud se trouve Gizab. Cette petite cité est connue pour sa lutte contre l'avancée du désert en plantant des milliers d'arbres.\n\nLa troisième région est appelé "Al'arkhabil alsama" ou l'archipel du ciel. Elle regroupe toutes les îles au nord. On y trouve des îles entièrement recouvertes de jungle ou des îles parcourues par d'immense chaîne montagne. Trois villes y sont particulièrement connues. Madja connue pour sa scierie et sont travaille du bois. Zametan est quant à elle une petite ville portuaire spécialisée dans la culture de perle et la confection de bijoux et tout au nord (hors maps) Raoued est une ville fortifiée connue pour ses chantier naval à la pointe de la technologie et de la magie.\n\nEnfin la dernière région est le sud-est du royaume appelé "Almawt Al'ahmar" ou la mort rouge à cause de la couleur ocre de ces gigantesques dunes et collines. Les conditions de vie y sont aussi extrêmes avec des écarts de température entre le jour et la nuit de plus 50 degrés et ce sans compter la flore et faune sauvage meurtrière. Seuls quelques groupes de nomades et quelques villes troglodytes y vivent. Il y a Alkwariz-mi ville portuaire a l'entrée du désert rouge, point d'entrée du commerce venue des autres continents. Shur-abak et Al-Kurfrah quant à elle son 2 citées fortement militarisé créé pour contrôler soit l'entrée du canal "Al Gharsa" soit l'extrême sud avec ça faille pas entièrement exploré que l'on appel "Al-Layl" la nuit.\n\nSultan / Sultane (roi / reine)\nSultane validé Titre honorifique porté par la mère du sultan.\nYabgu (prince)\nBeylerbey (duc)\nPacha (marquis)\nBey (comte ou baron)\nAtabeg (régent)\n\nSultan : Alym\n	1958-03-03 23:00:00	#813412	f	/flag/Le_Sultana_de_Sandarane.png
cbf00301-c56a-4702-92b7-c5fa6013f99a	Duchés des Dolomite	150000	Histoire :\nNation majoritairement Gnome elle a vassalisée le royaume de l’Antre après que les grands dragons chromatiques se soient retirés des affaires des mortels.\nLe Grand blocus maritime de l’an 1006 à fait céder l’Antre.\nTrès connue pour leurs école de magie chaque ville c’est spécifié dans une école particulière.\nEconomie :\nComment le système économique fonctionne ?\nBeaucoup de manufacture mixant ingénierie/magie ils exportent aussi beaucoup de matière première magique avec les cité libre et le sultanat de Sandarane.\nQuelles sont les ressources les plus précieuses ?\nLe Fer-dragon runique, cuire de dragon runique (très rare et illégale braconnage de Sangdragon)\nComment les ressources sont vendues ?\nEn contrat exclusif avec la C.C.C.H pour la partie illégale un cartel gère une partie des marchés noir avec la C.C.C.H\nQuelles sont les régions les plus riches ?\n\tLe Nord avec son commerce avec les cités libres.\nReligion :\ndieux/déesses des religions du monde ?\nAzouth et Gond est assez prié\nMyths and Legends ?\n\t-\nPrincipaux idéal ou principes ?\n\tla connaissance et la créativité \nPossible tentions entre les religions ? guerre ?\n\tNone\n\nMagie :\nChaque ville à école de magie spécialisé dans une école\nCalteri : Évocation\nArrezo : Transmutation\nVolturo : Abjuration\nRussolio : Invocation\nStiffe : Divination\nRaino : Illusion\nIserna  : Enchantement\nExecutive :\nSystème des gouvernements ? \nUn conseil des mages : Magisterium\nQui à le pouvoir ? et comment il s’échange ?\nLe conseil des mages est créé par chaque ville qui envoie un et le conseille élit le Roi Archimage pour 20 prochaine années. \nComment les lois sont gérées ?\nPar vote unanime ou à la majorité. \nQui gère l'application de la loi ? \n\tmaître de l’école de magie (le représentant au conseil)\nLe maire des villes, les chevaliers et miliciens.\nTopologie : \nZone géographique remarquable ?\nLa forêt d’argent.\nLe Lac Vert (au sud de la capital)\nComment les ressources naturelles sont-elles disponibles ?\n\tDes essences de bois rare, beaucoups de culture de fruits et légumes\nComment la géolocalisation influe-t-elle sur la survie des cultures ? \n\tUne culture basé sur beaucoups de commerce avec les cités libres et un peu avec le sultanat\nInhabitant :\nCombien de races intelligentes vivent dans le monde ? Comment interagissent- elles entre elles ?\nToutes mais peu de Sangdragon car mal vu après la vassalisation.\nCulture :\nQuelle est la fonctionnalité ou différence entre les cultures ?\n\tUn peuple en général assez réservé \nChef d'œuvre dans l’arts / littérature / architecture  ?\n\tLe sanctuaire au dragon taillé à même dans la montagne \nQuel conflit il y a dans votre société ?  de gros conflits  ? récurrent ?\n\tPas mal de tension entre Drakonien/Gnome \nQuels effets ces conflits ont sur le monde ?\n\tBeaucoups de rixe/raquette ciblé en les 2 races \nSociété :\nQuelles sont les races les plus importantes  ?\nLes Gnome.\nQui sont les moins ?\nLes Drakonien.\nComment elle coexiste ensemble ?\nMal tension entre Drakonien/Gnome	0101-11-27 23:50:39	#631ce9	f	/flag/Les_Duchés_Des_Dolomite.png
44383b5f-5ed4-4ae8-91ac-2c377928206e	Le Royaume de Gandorènne	350000	Monarchie dirigé d'une main de fer par David IV. (avec ça nouvelle épouse Geani) Elle fut créer il y a 100 ans (par David III), \n\nLa société se base sur un système de castes avec dans l'ordre la noblesse/érudit-mage > Les soldats et le clergé > les gens communs > les humains. \n\nActuellement en guerre froide avec le saint empire Momoritanien. Les 2 forces avance de plus en plus vers un conflit ouvert.\n\nla capital est Gandor et la richesse de l'empire ce fait grâce à l'abondance de denrée alimentaire. Au nord de Gandor beaucoup de plaine sont aménagés en exploitation agricole.\n\nLa population est assez éclectique(sauf Humain) :\n35% Tiffelin\n55% Autres \n10% Humain	\N	#640c0c	f	/flag/Le_Royaume_Gandorènne.png
0bcb8247-1ea9-48b1-9619-15b5de56ad9c	Le Saint-Empire Momoritanien	420000	Famille royal Kinemor :\nRhendom/Taripica\nCalison/Norima \nLimor * Lauc\nTenabis/Alménia \nYmal\n\nAléthérite :\nLa socité momoritanien évolue autour de Aléthérite un materieau récolté depuis les bois de grand cerf blanc sacré.Il ont était fait en cadeau part le Alion (nature/artisanat) après un coups d’états manqué formenté par un groupe de mages. \n\nIl a comme spécificité de nullifier les pouvoirs de magie d’éther. (tout sauf la magie des clercs)\nAléthérite se retrouve dans les bâtiments dans les armes, armures et accessoires. Elle peut être utilisée comme composé dans des potions qui neutralisent les pouvoirs de concentration.\n\nil y a approximativement 100 troupeaux qui varie entre 50 et 1000 têtes	0671-09-05 23:50:39	#1b20b6	f	/flag/Le_Saint-Empire_Momoritanien.png
4226ee30-e8a9-4817-910c-47baff2a7f2b	Cités libres	53000	Villes-États indépendantes (Alagir, Huriya), entre Gandorènne et le Saint-Empire.	\N	\N	f	\N
93bae9c3-0145-4431-968d-96534b04b8f3	Dominion de l'Antre	35900	Nation majoritairement drakônienne, vassale des Duchés des Dolomites ; capitale Brodnica.	\N	\N	f	\N
ac22e46a-65f4-440b-a76a-48078bae1167	Duchés des Dolomite	51900	Nation majoritairement gnome ; Magisterium ; a vassalisé l'Antre après le blocus de 1006.	\N	\N	f	\N
b602f1e4-44f6-4027-ad29-ecbaf335ad04	Royaume de la mère de pierre	\N	Royaume (détails généralités encore template dans les docx).	\N	\N	f	\N
75f06457-7f1b-4886-9dbd-a59105b4aee1	Royaume d'Alberan	\N	Guerre civile nord/sud elfique (glaces vs reboisement) ; capitale Velmira.	\N	\N	f	\N
b7e4c389-c493-496f-b0d8-6245e5a940ea	Royaume de Gandorènne	\N	Monarchie de David IV ; castes ; guerre froide avec le Saint-Empire.	\N	\N	f	\N
0853ab51-158a-4719-90c4-f705eb4f2b7f	Saint-Empire Momoritanien	9000	Capitale Momoritania ; Aléthérite ; famille royale Kinemor.	\N	\N	f	\N
a6de5bfd-20a6-419b-9226-3e5697c788e7	Sultanat de Sandarane	\N	Sud-est ; famille Alym ; jumeaux ; richesse commerce bois/perles/rhum.	\N	\N	f	\N
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
3c18defa-d36d-4ed9-82f6-f53b3f1d0407	Armistice entre Gandorènne et le Saint-empire Momoritanien	Armistice entre Gandorènne et le Saint-empire Momoritanien	873	Armistice entre Gandorènne et le Saint-empire Momoritanien	2026-03-15 21:41:41.86	2026-03-27 10:01:48.805	f	{Général,Paix,Gandorènne,Momoritanie}
4e0250de-ccc9-413f-8261-42bf6dfc1b75	Explosion à Brodnica qui signe la capitulation de l'Antre	Explosion à Brodnica qui signe la capitulation de l'Antre	897	Explosion à Brodnica qui signe la capitulation de l'Antre	2026-03-15 21:43:31.609	2026-03-27 10:02:52.139	f	{Général,Paix,L'Antre,Dolomites}
\.


--
-- Data for Name: LoreCity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LoreCity" (id, "loreId", "cityId") FROM stdin;
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
\.


--
-- Data for Name: LorePerson; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LorePerson" (id, "loreId", "personId") FROM stdin;
\.


--
-- Data for Name: LorePlace; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LorePlace" (id, "loreId", "placeId") FROM stdin;
\.


--
-- Data for Name: Organisation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Organisation" (id, name, description, "parentOrganisationId", "organisationType", "isForDM", flag, membership) FROM stdin;
10191847-6d98-45df-8891-923707810383	Maison Palhindile	Type (lore) : famille-maison.\n\nDiplomatie & verre.	\N	\N	f	\N	POLITIC
b3a79c19-75b6-4706-9d20-03afe562ba30	Maison Cilovard	Type (lore) : famille-maison.\n\nFinance.	\N	\N	f	\N	POLITIC
191ca64f-556b-4811-bb43-6fd88a908d1f	Soleil Pourpre	Type (lore) : milice.	\N	PRINCIPAL	f	\N	MILITAIRE
b9ea6c33-b824-432a-9230-8b956b0625da	Syndicat (Alagir)	Type (lore) : criminalite.	\N	PRINCIPAL	f	\N	CRIMINALITE
d9a9ba92-035c-403d-aa42-05720a53fd46	Syndicat (Huriya)	Type (lore) : criminalite.	\N	PRINCIPAL	f	\N	CRIMINALITE
75c3fe17-a898-4920-bc46-f92d78b0c230	Conseil d'Acier	Type (lore) : organisation-secrete.	\N	PRINCIPAL	f	\N	OTHER
6729d509-1685-4d0e-95cd-0be9fe3cb4ba	Œil Pourpre / Soleil Pourpre (façade)	Type (lore) : organisation-secrete.\n\nDoc Alagir.	\N	PRINCIPAL	f	\N	OTHER
8d658fff-6cdc-40f0-9808-8e3bddb19cfd	Couronne de Platine	Type (lore) : banque.	\N	\N	f	\N	MARCHAND
b6939517-f8cb-4d29-8436-f557239418be	Caisse des Richesses Cachées	Type (lore) : banque.	\N	\N	f	\N	MARCHAND
ffedda64-50a5-4ba0-9dad-843d0939378f	Famille Ivelis	Type (lore) : famille-dirigeante.	\N	PRINCIPAL	f	\N	POLITIC
cd361a6f-690d-4ef4-be74-57f11d106bfa	Écus d'or	Type (lore) : milice.	\N	PRINCIPAL	f	\N	MILITAIRE
6429c02f-e1c0-457d-827f-16af1f585c6f	Le Syndicat	organisation de voleur	\N	PRINCIPAL	f	\N	\N
0d14ee13-6fc4-4e95-be91-38cc9e6e5553	Les écailles de Cendre	Un repaire du Syndicat à Huriya\n\nComportement tactique\nLe Syndicat n’engage jamais tous ses effectifs d’un coup\nIls utilisent :\nles escaliers étroits\nles portes verrouillées\nla fumée et l’obscurité\nSi Raskel fuit → la cellule change de planque sous 48h.\n	6429c02f-e1c0-457d-827f-16af1f585c6f	CELLULE	f	\N	\N
7aee1107-385a-464d-bcd1-4d74f05f0624	Compagnie des Voiliers d'Éther	Type (lore) : guild.	\N	\N	f	\N	MARCHAND
f14b3daa-1a98-4175-aa87-ede5f0505c43	La Lentille Brisée	La Cellule huriyeinne du Conseil d'Acier.\n\nLe Conseil d’Acier n’affiche jamais sa présence à Huriya. Ici, il agit par intermédiaires, combats truqués, dettes et silence.\n Le Monocle du Diable sert de point d’ancrage, de lieu de recrutement et de couverture pour les opérations illégales.\nLa cellule n’est pas grande — 9 membres actifs, une vingtaine d’affiliés — mais extrêmement violente et efficace.	a1a93da1-c7f4-4a7a-90e2-fd1c8b690837	CELLULE	f	\N	CRIMINALITE
a1a93da1-c7f4-4a7a-90e2-fd1c8b690837	Conseil d'acier	Groupe de banditisme présent dans tout le continent 	\N	PRINCIPAL	f	\N	CRIMINALITE
4b85688f-7d24-4138-8840-9fdfdd249577	Alliance des Veines	Type (lore) : faction.	\N	\N	f	\N	OTHER
d9c8c611-2986-4e8c-856f-465fecbcdf16	Garnison des écus d'or	Garnison des Écus d'Or\n\nSécurité de la ville est maintenue par une Cohorte de mercenaire appelé les écu d’or. Elle connue pour excellé dans l'entraînement de ces recrues.\n\n\nGrade :\n Commandant Suprême\n Conseiller Émérite\n Capitaine de la Garde\n Capitaine des Archers\n Maître d'Armes\n Sergent-Major\n Sergent de Peloton\n Garde Émérite\n\n	\N	PRINCIPAL	f	\N	MILITAIRE
39907562-4239-439c-9c32-2532abbae19b	C.C.C.H	Type (lore) : organisation.\n\nContrebande / cartel lié doc Dolomites & Antre.	\N	\N	f	\N	OTHER
294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	Clan Elurra (la neige)	Type (lore) : clan.	\N	\N	f	\N	POLITIC
97523dca-51a9-4540-8d4f-cc61ffd6c5f4	Clan Mendia (la montagne)	Type (lore) : clan.	\N	\N	f	\N	POLITIC
91121a6b-760d-4d08-8da9-59e1bb5fb66a	Clan Itsasoa (la mer)	Type (lore) : clan.	\N	\N	f	\N	POLITIC
cbb579e8-aee5-4d8e-b9da-19e0f44dad0b	Clan Gerlaria (le guerrier)	Type (lore) : clan.	\N	\N	f	\N	POLITIC
72020f98-e744-4fa4-8a60-6ea12e81bb85	Famille Royal Ivelis Huriya	Famille dirigeante : Famille Ivelis\n\nMr Aimon - Mme Sana   \t\t       Mr Volodar \n\t        |\t\t\t\t                   |\nAkkar(M) Ilrune(M) Galya(F)\t\t Keerla(F)\n\n	\N	PRINCIPAL	f	\N	POLITIC
4ef8566e-f07e-4d18-bcb5-3222abdf3c5b	Maison Tovalis	Type (lore) : famille-maison.\n\nCommerce & carrières.	\N	\N	f	\N	POLITIC
1ac789f7-01b6-4c67-a1c2-843215557e9e	Famille Tomasio (comtes Dolomites)	Type (lore) : famille.	\N	\N	f	\N	POLITIC
e5371ee3-320b-4b54-9316-83ff45aa9e22	Magisterium	Type (lore) : gouvernement-magique.	\N	PRINCIPAL	f	\N	POLITIC
8ae95108-d76f-4e8c-8dd1-e18918d5d788	Consortium de l'Ardoise	Type (lore) : commerce.	\N	\N	f	\N	MARCHAND
f57a4db9-6bbe-4a36-82f8-72a94bf2f2cb	Famille Elvaltis	Type (lore) : famille-dirigeante.	\N	PRINCIPAL	f	\N	POLITIC
1e68b5ab-f032-49cf-80ee-18a32c2e34c0	Famille royale Kinemor	Type (lore) : famille-dirigeante.	\N	PRINCIPAL	f	\N	POLITIC
e3c68cda-3f8c-473d-a0e8-a165b71da2b4	La Main du Silence	Type (lore) : faction.\n\nDoc empire, détail à compléter.	\N	\N	f	\N	OTHER
13340295-211d-4dd8-8c6d-b1baf9ee7690	Famille Alym	Type (lore) : famille-dirigeante.	\N	PRINCIPAL	f	\N	POLITIC
12308d07-5349-4643-b829-0b3c01f3a02b	Culte de Tiamat	Type (lore) : culte.	\N	PRINCIPAL	f	\N	RELIGEUX
af81ff7a-de0d-418d-93d6-c4d2423b9e14	Cellule du Monocle (Lentille Brisée)	Type (lore) : cellule.\n\nConseil d'Acier.	75c3fe17-a898-4920-bc46-f92d78b0c230	CELLULE	f	\N	OTHER
\.


--
-- Data for Name: OrganisationCity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationCity" (id, "organisationId", "cityId") FROM stdin;
3ee47a25-e7d0-4ac7-b121-13061d89f613	0d14ee13-6fc4-4e95-be91-38cc9e6e5553	57171985-dade-4fcc-a00b-c06de058c7d6
59c78115-d784-43e6-9196-3ceff653b023	f14b3daa-1a98-4175-aa87-ede5f0505c43	57171985-dade-4fcc-a00b-c06de058c7d6
bbafdbf4-605d-47e0-a089-3c6eee12306a	d9c8c611-2986-4e8c-856f-465fecbcdf16	57171985-dade-4fcc-a00b-c06de058c7d6
99369d5f-a74f-418d-9375-ca572be2fefd	72020f98-e744-4fa4-8a60-6ea12e81bb85	57171985-dade-4fcc-a00b-c06de058c7d6
a5c80e3a-7894-42f1-9373-bea255712753	4ef8566e-f07e-4d18-bcb5-3222abdf3c5b	55787c45-48b6-441b-b551-1ef3c3825a08
bf7155d0-e01e-48a1-bb9e-850982221595	10191847-6d98-45df-8891-923707810383	55787c45-48b6-441b-b551-1ef3c3825a08
eac905f3-626b-46eb-98fc-947d475f6ccc	b3a79c19-75b6-4706-9d20-03afe562ba30	55787c45-48b6-441b-b551-1ef3c3825a08
5bb2af7e-cf18-4e84-948d-6bb85385c70c	191ca64f-556b-4811-bb43-6fd88a908d1f	55787c45-48b6-441b-b551-1ef3c3825a08
72b450bb-4aff-4304-9551-5c6b828e6721	b9ea6c33-b824-432a-9230-8b956b0625da	55787c45-48b6-441b-b551-1ef3c3825a08
1dfff8ce-a721-4180-8c15-fece6c9e1365	d9a9ba92-035c-403d-aa42-05720a53fd46	d8c2ee3e-f123-4338-872f-72ada526811e
9e23d360-3584-4378-a474-efb7823720fb	75c3fe17-a898-4920-bc46-f92d78b0c230	55787c45-48b6-441b-b551-1ef3c3825a08
de11ac11-eba5-4ed8-a3d9-a0145fc83557	75c3fe17-a898-4920-bc46-f92d78b0c230	d8c2ee3e-f123-4338-872f-72ada526811e
a80055e3-fcc5-4236-b441-c25c74d21f7f	75c3fe17-a898-4920-bc46-f92d78b0c230	c867f929-58f0-4918-98b4-f6eab7e78bfa
cf8b64c1-29b6-4c35-ab65-3118758ff1d2	75c3fe17-a898-4920-bc46-f92d78b0c230	3df2a5ac-e15a-45d9-a1fd-cd755b855bb0
7d4db35d-59e5-43b7-8b07-ece8b19b257d	75c3fe17-a898-4920-bc46-f92d78b0c230	e79e83d8-8e67-4511-a3f0-14911ea12b93
b18296b5-6081-454b-a6cc-3ec56cbf9bc4	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	55787c45-48b6-441b-b551-1ef3c3825a08
fcbbdaff-d610-4d9c-b38f-56a30722e789	8d658fff-6cdc-40f0-9808-8e3bddb19cfd	55787c45-48b6-441b-b551-1ef3c3825a08
29a9d83c-9b10-456e-9589-8b320c74281b	b6939517-f8cb-4d29-8436-f557239418be	55787c45-48b6-441b-b551-1ef3c3825a08
95d3c736-f1e3-489c-9f01-4937d19c574c	ffedda64-50a5-4ba0-9dad-843d0939378f	d8c2ee3e-f123-4338-872f-72ada526811e
0782992a-9c52-4f17-be92-443747dad953	cd361a6f-690d-4ef4-be74-57f11d106bfa	d8c2ee3e-f123-4338-872f-72ada526811e
88bc7729-9b53-4781-b8a9-0dfdf2322bf8	7aee1107-385a-464d-bcd1-4d74f05f0624	d8c2ee3e-f123-4338-872f-72ada526811e
578f54ba-eaa1-4017-aa8e-92c73a5f9369	4b85688f-7d24-4138-8840-9fdfdd249577	d8c2ee3e-f123-4338-872f-72ada526811e
5bc237a0-5111-4924-9944-dc3fd3728ace	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	c867f929-58f0-4918-98b4-f6eab7e78bfa
ddf305e4-9fef-4acd-9af0-ed08f64d1553	97523dca-51a9-4540-8d4f-cc61ffd6c5f4	c867f929-58f0-4918-98b4-f6eab7e78bfa
4835113c-9bdf-4235-b4a3-cda2778f99d6	91121a6b-760d-4d08-8da9-59e1bb5fb66a	c867f929-58f0-4918-98b4-f6eab7e78bfa
a019bad0-3f31-4f21-9743-82cd74efe4ba	cbb579e8-aee5-4d8e-b9da-19e0f44dad0b	c867f929-58f0-4918-98b4-f6eab7e78bfa
1da8e7f3-dd95-4a37-9b24-9d98ecf373de	1ac789f7-01b6-4c67-a1c2-843215557e9e	c867f929-58f0-4918-98b4-f6eab7e78bfa
f5c702ce-0a09-43b9-8f40-0a9c7cb330d3	8ae95108-d76f-4e8c-8dd1-e18918d5d788	61055654-0579-4a5b-9e2c-eed4452c7922
978f49fb-5eaa-45b6-845d-2e4495b37c5d	f57a4db9-6bbe-4a36-82f8-72a94bf2f2cb	61055654-0579-4a5b-9e2c-eed4452c7922
82eb981c-b41d-4dc7-b3f8-2832d02120a8	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	a52c50ca-10f3-493f-877b-13fc5f989fda
803d0156-ec2b-4819-b9fe-26ec9bda1dd2	13340295-211d-4dd8-8c6d-b1baf9ee7690	5ea76c42-f49b-4b66-8d6e-bf914ef8018d
aedb3400-2c7f-4100-9ba6-62b2aa0bb3cc	af81ff7a-de0d-418d-93d6-c4d2423b9e14	d8c2ee3e-f123-4338-872f-72ada526811e
\.


--
-- Data for Name: OrganisationKingdom; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationKingdom" (id, "organisationId", "kingdomId") FROM stdin;
bdfb2985-d21d-40d9-a8a6-de7c23cebcde	4ef8566e-f07e-4d18-bcb5-3222abdf3c5b	4226ee30-e8a9-4817-910c-47baff2a7f2b
6a78f210-4ab9-4e2a-8ec8-41ef2f9fc474	10191847-6d98-45df-8891-923707810383	4226ee30-e8a9-4817-910c-47baff2a7f2b
582e9881-c548-4fa0-8333-1a7b1c079f01	b3a79c19-75b6-4706-9d20-03afe562ba30	4226ee30-e8a9-4817-910c-47baff2a7f2b
4ba935b8-be9d-47da-8bc5-1533936ff403	191ca64f-556b-4811-bb43-6fd88a908d1f	4226ee30-e8a9-4817-910c-47baff2a7f2b
1bdd3a1f-7e1c-4cf3-94d3-694cc5f672c8	b9ea6c33-b824-432a-9230-8b956b0625da	4226ee30-e8a9-4817-910c-47baff2a7f2b
da5e5d77-4ee2-4aa4-9f63-199907d3d74f	d9a9ba92-035c-403d-aa42-05720a53fd46	4226ee30-e8a9-4817-910c-47baff2a7f2b
baa3805d-d444-40e9-81bd-3bf14c528f02	75c3fe17-a898-4920-bc46-f92d78b0c230	4226ee30-e8a9-4817-910c-47baff2a7f2b
0826312f-eb0e-4f2e-9b37-2076ba799241	75c3fe17-a898-4920-bc46-f92d78b0c230	93bae9c3-0145-4431-968d-96534b04b8f3
cb41c4fe-4767-4d3b-a3e7-b235ffa6dd9a	75c3fe17-a898-4920-bc46-f92d78b0c230	ac22e46a-65f4-440b-a76a-48078bae1167
e49d6e85-2d28-48a3-888d-783cb26632ec	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	4226ee30-e8a9-4817-910c-47baff2a7f2b
dd2e55c4-21b4-4247-a378-1bcb97285264	8d658fff-6cdc-40f0-9808-8e3bddb19cfd	4226ee30-e8a9-4817-910c-47baff2a7f2b
b156cfc1-5f18-4812-90ff-2d1419766523	b6939517-f8cb-4d29-8436-f557239418be	4226ee30-e8a9-4817-910c-47baff2a7f2b
41946f36-c997-4b21-a67e-20e1e59f147f	ffedda64-50a5-4ba0-9dad-843d0939378f	4226ee30-e8a9-4817-910c-47baff2a7f2b
a2b762f8-69ea-4265-b43a-6a77c987f7b2	cd361a6f-690d-4ef4-be74-57f11d106bfa	4226ee30-e8a9-4817-910c-47baff2a7f2b
8566d6f4-aefd-468e-bc7d-f23f364ae410	7aee1107-385a-464d-bcd1-4d74f05f0624	4226ee30-e8a9-4817-910c-47baff2a7f2b
e4f6914e-21af-4718-8038-b084c0e5ca55	4b85688f-7d24-4138-8840-9fdfdd249577	4226ee30-e8a9-4817-910c-47baff2a7f2b
cad4b18a-3c2c-4956-90a4-763816ecfc06	39907562-4239-439c-9c32-2532abbae19b	93bae9c3-0145-4431-968d-96534b04b8f3
5cff824f-76df-4bb5-9f85-d34513a5fb85	39907562-4239-439c-9c32-2532abbae19b	ac22e46a-65f4-440b-a76a-48078bae1167
f3412901-4cb1-45b1-8091-09c2fb4db973	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	93bae9c3-0145-4431-968d-96534b04b8f3
817a19d8-2341-486a-a97f-861aafe85bf9	97523dca-51a9-4540-8d4f-cc61ffd6c5f4	93bae9c3-0145-4431-968d-96534b04b8f3
07a7a53e-c551-4aa4-a3c5-bd25fe66360b	91121a6b-760d-4d08-8da9-59e1bb5fb66a	93bae9c3-0145-4431-968d-96534b04b8f3
99f8c4bd-4283-4849-b4bd-3ff008dd5c49	cbb579e8-aee5-4d8e-b9da-19e0f44dad0b	93bae9c3-0145-4431-968d-96534b04b8f3
886f9090-b82f-454b-b523-07c4a76ffffe	1ac789f7-01b6-4c67-a1c2-843215557e9e	93bae9c3-0145-4431-968d-96534b04b8f3
2c53d1af-bcb3-4b69-8974-4dce4650534b	1ac789f7-01b6-4c67-a1c2-843215557e9e	ac22e46a-65f4-440b-a76a-48078bae1167
e4ddfea7-d597-4523-9729-08c51fe38bea	e5371ee3-320b-4b54-9316-83ff45aa9e22	ac22e46a-65f4-440b-a76a-48078bae1167
a368ca41-9b02-4f3a-b1fc-a72562402877	8ae95108-d76f-4e8c-8dd1-e18918d5d788	0853ab51-158a-4719-90c4-f705eb4f2b7f
d6ae66d8-d05d-4e72-bea5-4093915437a0	f57a4db9-6bbe-4a36-82f8-72a94bf2f2cb	0853ab51-158a-4719-90c4-f705eb4f2b7f
ca08a0cc-7b00-4ff9-8755-e207437869d8	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	0853ab51-158a-4719-90c4-f705eb4f2b7f
0cb18d42-7206-4f60-8f8b-2a5c022beca2	e3c68cda-3f8c-473d-a0e8-a165b71da2b4	0853ab51-158a-4719-90c4-f705eb4f2b7f
87f9b5c9-60ac-4723-b2b6-f2b18efdb40a	13340295-211d-4dd8-8c6d-b1baf9ee7690	a6de5bfd-20a6-419b-9226-3e5697c788e7
9cea2296-2763-4f37-83b8-946af2611d5f	12308d07-5349-4643-b829-0b3c01f3a02b	93bae9c3-0145-4431-968d-96534b04b8f3
89c9fd2a-c546-40b0-9a40-7ad20ff33377	af81ff7a-de0d-418d-93d6-c4d2423b9e14	4226ee30-e8a9-4817-910c-47baff2a7f2b
\.


--
-- Data for Name: OrganisationMember; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationMember" (id, "organisationId", "personId") FROM stdin;
f6d6d284-d2e7-4a39-992b-c1b57bb6e9cb	191ca64f-556b-4811-bb43-6fd88a908d1f	885e8784-80de-4a10-b09b-e7f75e3f114b
575bbbdd-f1a1-40a8-8de3-40340cbc5a42	8d658fff-6cdc-40f0-9808-8e3bddb19cfd	18c38b2d-c41a-4703-80b5-3f4fd4c1dfac
0b8de7c8-54ef-4145-a360-8447d09b0bd0	b9ea6c33-b824-432a-9230-8b956b0625da	64d43c26-1baf-4d0d-809c-af184e30eac7
1f9c1bb8-5740-4b0f-851f-2f0107a73bb4	75c3fe17-a898-4920-bc46-f92d78b0c230	5e200bc9-a7ad-4da4-ad06-4d7f7aa936ef
39225bba-e266-4308-869e-18a3fbfa07da	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	88a7345e-c964-4aa9-8510-770ffbe03494
6ab8bb2c-64ec-4c7b-a75c-1f57dfcf90e9	ffedda64-50a5-4ba0-9dad-843d0939378f	56929e8b-b74f-4460-b7b9-851b98449237
1978a750-e2c5-49da-97d4-0ec4b3eda02a	ffedda64-50a5-4ba0-9dad-843d0939378f	83c44434-de64-4102-a7b7-7fdf3a44d36d
0f415a64-fce1-4515-ba1e-d14175c68a5f	ffedda64-50a5-4ba0-9dad-843d0939378f	cb838b2f-afc7-4e74-b105-2ccdb33e6bdb
dd8d95f6-a1b2-455d-b639-556618f7cd02	ffedda64-50a5-4ba0-9dad-843d0939378f	416c8c3e-d99c-4af9-b3e1-def8cf141d29
045c9776-71ae-4222-b9c0-10a46787cc84	ffedda64-50a5-4ba0-9dad-843d0939378f	48a75c4f-2ecb-4b21-a789-713e583e4c14
13ef2b05-09ea-4534-80c5-fd6fd2af3bee	ffedda64-50a5-4ba0-9dad-843d0939378f	125faf06-5315-4081-85a6-c07d0de5bd23
69739415-d826-4718-94f1-69f5e08e61ce	ffedda64-50a5-4ba0-9dad-843d0939378f	9c9071e4-660c-4a05-8db9-f682cf806b0b
b6dc3477-122d-4527-b633-24fe9065e29d	cd361a6f-690d-4ef4-be74-57f11d106bfa	1aa20150-7156-4743-929f-9b692acc4e87
4a281742-efe7-4698-af37-0e46d0d64615	d9a9ba92-035c-403d-aa42-05720a53fd46	ea5a6736-3483-4276-b508-a9fc5a764c0b
cb53b5bd-8ce4-46f1-8789-bd9c01f3ee92	4b85688f-7d24-4138-8840-9fdfdd249577	ea5a6736-3483-4276-b508-a9fc5a764c0b
2b0a1b11-d2b1-47d2-94b8-8d46ae5fe97e	4b85688f-7d24-4138-8840-9fdfdd249577	9f64908e-8fa8-413f-b22c-b56c780d838e
d05ab89b-7412-4265-8580-b22564b8fd44	75c3fe17-a898-4920-bc46-f92d78b0c230	d67aeebf-fe10-4095-b398-72ff920916c6
80c1da53-83ca-450d-b7a5-479348348e00	7aee1107-385a-464d-bcd1-4d74f05f0624	d67aeebf-fe10-4095-b398-72ff920916c6
7996afa5-c12e-4bd5-9687-b8e31da069e3	75c3fe17-a898-4920-bc46-f92d78b0c230	49906b5a-7730-4311-97b2-b328d8ac41ac
962b1ebd-83a3-4c6b-804e-8d854f1339a7	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	49906b5a-7730-4311-97b2-b328d8ac41ac
9df13066-61f4-4d1a-9c3e-b2484971fe93	f57a4db9-6bbe-4a36-82f8-72a94bf2f2cb	410a490f-a856-4f7d-bd16-f5487a3a7d87
079c72e3-bdd4-4999-a2aa-24a03b19852b	f57a4db9-6bbe-4a36-82f8-72a94bf2f2cb	5f6dc1c0-442e-471a-9b64-018d6a2576c5
de3f9056-d892-4415-a517-fdbf4b5440cc	f57a4db9-6bbe-4a36-82f8-72a94bf2f2cb	f20a199b-9864-46bc-9773-8f00d021be0a
0d714133-ef95-46ec-af5e-c4d15cc274c0	f57a4db9-6bbe-4a36-82f8-72a94bf2f2cb	435d48c9-26cb-43b9-9d21-1af6fd1a873f
3d28c323-59f8-4665-9626-9dd982e561a7	8ae95108-d76f-4e8c-8dd1-e18918d5d788	12a6113d-b104-46aa-bfb9-d8e6257f0c1b
d054e45e-8ce2-414c-8cc2-1effb159f207	8ae95108-d76f-4e8c-8dd1-e18918d5d788	398fdec4-8c8e-45cb-bf14-21ecc801b24e
1cec3e50-2d0f-46cd-851e-cb25872867f6	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	ff302943-8f32-4e85-9b57-c4613a0b8b09
9a901e6b-c3bf-48e1-bf5a-1acbccafd7c0	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	6a2db9ac-4609-4612-99a3-5ac4ef07cef7
7810f631-8e02-4f2f-8856-812767925729	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	f78434f9-9757-4089-b49d-2b61e8616303
6bbac0d3-bfb5-4cb1-b777-278abb629045	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	69c6ef2f-48d8-43e2-a984-ed344e578352
e30c73c0-b76f-49ba-9444-884baf1f587d	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	42f485ff-2400-4127-a1d1-23d4019cc21b
93602f97-2fe8-434a-927d-98106c147329	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	378aa9de-f8bf-481b-bca9-2dc42bb5c05d
7bc2bfd4-a91a-4eae-b7d1-aa1325ac9fef	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	0520cf53-4096-4ff5-afe0-af707e3f8282
d8401a28-190a-4fda-ac88-ba1e5300d7e2	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	86e9b5f1-e4de-4c2b-9350-5e7c0a5c2065
6f664285-8e1c-4045-9f77-46dc05b50ca6	1e68b5ab-f032-49cf-80ee-18a32c2e34c0	7b0679a6-8fd2-43a2-b7dc-e65eb6334cef
4a59de5b-c691-4728-8239-6be19fa5b47d	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	7154f346-6dae-42bd-a768-a6b3ac54c5bc
f2a682a7-eccf-4370-a237-3145bc97dbbf	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	1c0882ff-e9c5-4326-9ee8-9b36049c69ea
8f1e9236-a452-415f-9f94-3a8184645f40	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	0faeab92-8111-4d00-983d-ce7124f1f6c4
d0cf6820-f9e4-4ca0-bf67-b2a22b65a9bb	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	edbaba13-4294-4842-b73c-2f1f4b73dd8f
9a6452e3-255a-43cb-a6b3-0a05c1875e0e	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	9d4af2ec-f0c0-461f-9544-6b6239ea69b6
98a32231-cbb0-4539-819c-e7b864992415	294e8a5b-d75f-49a9-b0d5-6bcfe6717e72	b1002fad-2c80-436b-a67e-4e73b33cafe7
0d49ac1a-942e-448b-981d-93f2b50d1fae	1ac789f7-01b6-4c67-a1c2-843215557e9e	cf748374-1bfb-495b-864f-8df3f4295277
3dc82b08-38a1-43ee-8c4a-dd2513bc4aa5	1ac789f7-01b6-4c67-a1c2-843215557e9e	1e997704-5ea2-410e-8fe9-57794155d45c
680b9d1a-9608-4107-a8aa-7899d1225943	1ac789f7-01b6-4c67-a1c2-843215557e9e	70ec3e88-19f2-4b45-9f1a-a6cf0e424b82
d453cb66-7688-45ce-a3fc-4909668d652c	1ac789f7-01b6-4c67-a1c2-843215557e9e	4e6b0b0a-cc09-4a0d-8d36-a1bd81f939df
f459a55a-3a97-4d03-a995-41767d684c40	1ac789f7-01b6-4c67-a1c2-843215557e9e	eb754905-eff3-459c-a048-5e384c88b939
989d73ab-dffc-4794-a706-fa2cab46655e	1ac789f7-01b6-4c67-a1c2-843215557e9e	604c2fbb-7b71-4ec7-bcbc-42e12e1739fe
4f477fec-fff7-42ba-9004-844b78fe33b9	75c3fe17-a898-4920-bc46-f92d78b0c230	9c6db340-1204-4315-9480-29424d7b5ef3
a1311a97-5433-4be5-943a-2622084fbb33	75c3fe17-a898-4920-bc46-f92d78b0c230	498fe191-41ce-4460-96b6-8bedb97b2ae4
c0aa087c-2c9e-492a-a8f8-ffedb9f432e8	75c3fe17-a898-4920-bc46-f92d78b0c230	e3d3bf00-ab94-4687-804f-631bcdb4fdc5
710046df-9442-44ab-a5e9-babfb637c565	75c3fe17-a898-4920-bc46-f92d78b0c230	00f1a34d-f19c-4166-8358-dab613152262
f4be95b3-c301-42fe-83c8-53ad455c29f1	e5371ee3-320b-4b54-9316-83ff45aa9e22	9f6cbebf-5beb-4646-bdb3-effd7579001f
e014cc90-09a9-4cf3-97fd-45350b48bf52	e5371ee3-320b-4b54-9316-83ff45aa9e22	3ac3ce66-b714-4d75-b16d-5c50de3f9d63
b709fd3f-46ad-4a38-ab2c-80d7de7c59f0	e5371ee3-320b-4b54-9316-83ff45aa9e22	10ee53f4-ad08-4290-a61a-671be30bd140
94d764be-405a-4ea7-916c-b7334fdeb1de	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	05c8cd3f-6d40-4fc7-a0a2-54325582ea60
7a114edb-4cfb-4cf0-9ff4-efca0215d21f	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	235535c8-aaef-49e0-9363-7151c602e107
6df86581-6c8f-416d-bb6f-34752ff22f46	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	872008bd-56c8-4c1c-9449-e7a5bf65924a
47b6e3b3-2960-432c-8102-795301f9307b	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	b49678fc-5e93-4615-a825-052d3dcff871
42f197a2-162f-4cd7-a654-d0070a64702f	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	15e5f194-3bb1-4cf0-a908-be9bbb3173db
b0c52f5a-0b1e-4909-8627-cedf2ab2232f	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	7a25c962-9a00-4823-8c1f-97310b9f9a43
3de82c47-f3b1-4d8e-9732-f4e55da626f6	6729d509-1685-4d0e-95cd-0be9fe3cb4ba	33d4a208-5507-42ea-bd84-bff40abcf225
7b41fdba-d3d4-4bfb-bb1c-1d38ed9fc498	13340295-211d-4dd8-8c6d-b1baf9ee7690	beddeff6-3707-4611-88e7-0d2433576c28
25f9ae48-7e04-493f-b8b7-07a9691e8dc2	13340295-211d-4dd8-8c6d-b1baf9ee7690	d02c6b35-6b00-4246-aae6-19e1ca3d1b95
\.


--
-- Data for Name: OrganisationPlace; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrganisationPlace" (id, "organisationId", "placeId") FROM stdin;
1e85c772-624a-4c45-b9c0-83cb96fc085c	0d14ee13-6fc4-4e95-be91-38cc9e6e5553	6a3f2770-8383-4464-b840-90386200965c
335b77c0-be7d-42a9-be67-c6d4cebbc92a	f14b3daa-1a98-4175-aa87-ede5f0505c43	fed68392-d8e5-4a62-8b23-b12296f6519d
\.


--
-- Data for Name: PersonOfInterest; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PersonOfInterest" (id, name, description, "imageUrl", "STR", "DEX", "CON", "INT", "WIS", "CHA", "kingdomId", "cityId", "placeId", breed, sex, membership, languages, "districtId", "isForDM", ca, pv, "showOnMap") FROM stdin;
5e8db395-6054-40e6-bd92-ef809166fa15	Hommes de Main du Syndicat (x5)	\nTraits\nAttaque Sournoise (2d6, 1/tour si allié adjacent ou avantage)\nSale Combine : avantage si la cible est à terre ou entravée.\nActions\nDague : +5, 1d4+3\nFilet (1/combat) : entrave (DEX DD 13)	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	\N	\N	CRIMINALITE	{}	\N	f	14	32	f
3511d7a5-70d7-4985-9012-a6682b351ce8	Vael Korshen	Stratège du Conseil\n\n\nVitesse 9 m\n\nCompétences Persuasion +6, Intimidation +6, Tromperie +6, Perception +4\nJets de sauvegarde INT +6, CHA +6\nTraits\nCommandement Calculé (Recharge 5–6) : en bonus action, 2 alliés font immédiatement une attaque ou un déplacement.\nToujours un Plan : 1 fois/jour, annule un coup critique contre lui ou un allié visible.\nActions\nDague empoisonnée : +6, 1d4+4 perforant + 2d6 poison\nMot de Ruine (1/jour) : Suggestion (DD 14)	\N	10	14	14	16	13	16	\N	57171985-dade-4fcc-a00b-c06de058c7d6	fed68392-d8e5-4a62-8b23-b12296f6519d	HUMAIN	MAN	CRIMINALITE	{ELFIQUE,COMMUN,ORC,ARGOT_VOLEUR}	\N	f	14	78	f
3ffea450-a1d7-4505-8008-5fd47e93abb5	Melrilvaethor Quifaren	Agent & Recruteuse\n\nTraits\nŒil du Conseil : avantage aux jets d’Intuition et Perception.\nDette de Sang : une cible marquée a désavantage contre elle.\nActions\nRapière : +6, 1d8+4\nDague cachée : +6, 1d4+4\nAction bonus : Désengagement	\N	10	16	14	10	10	15	\N	57171985-dade-4fcc-a00b-c06de058c7d6	fed68392-d8e5-4a62-8b23-b12296f6519d	DEMI_ELFE	WOMAN	CRIMINALITE	{COMMUN,NAIN,ELFIQUE,HALFELIN,ORC,ARGOT_VOLEUR}	\N	f	14	52	f
38e8071e-b2f2-4f88-ac70-4e3e80fd6f7d	Mirell “la Silencieuse”	Âge apparent : 30 ans\n\nApparence\nMirell est grande, fine, à la peau dorée et aux traits doux. Ses cheveux noirs sont toujours attachés en une tresse serrée qui tombe dans son dos. Ses yeux ambrés évitent souvent les regards directs. Elle porte des vêtements sobres, presque modestes pour son métier, et se déplace avec une lenteur mesurée.\n\nPersonnalité\nDiscrète, posée, presque effacée. Mirell parle peu, mais quand elle le fait, ses mots sont toujours choisis avec soin. Elle semble observer sans juger, ce qui la rend étrangement rassurante pour certains clients.\n\nRôle dans le jeu\nElle a été contrainte de travailler pour le Syndicat\nSert parfois de messagère involontaire\nPourrait demander l’aide des PJ pour fuir\nConnaît un passage discret reliant l’étage à l’arrière de la taverne\n	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	WOMAN	CRIMINALITE	{COMMUN,NAIN,ELFIQUE,GNOME,HALFELIN,ARGOT_VOLEUR}	\N	f	\N	\N	f
a50188f9-724b-4ba6-b62b-0a1a0f43bf97	Brakk “l’Enclume”	Maître de l’Arène\n\nTraits\nImplacable : quand Brakk tombe à 0 PV, il reste à 1 PV (1/jour).\nSeigneur de l’Arène : avantage aux attaques dans l’arène.\nActions\nMultiattaque (2 attaques)\nMarteau d’arène : +7, 1d10+4 contondant\nProjection brutale : test de FOR opposé, la cible est projetée et à terre	\N	18	12	18	8	10	11	\N	57171985-dade-4fcc-a00b-c06de058c7d6	fed68392-d8e5-4a62-8b23-b12296f6519d	DEMI_ORC	MAN	CRIMINALITE	{COMMUN,ORC,ARGOT_VOLEUR}	\N	f	15	95	f
12a6113d-b104-46aa-bfb9-d8e6257f0c1b	Tharim Dastren	Maître des carrières	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
88682d84-12ec-48fa-8ede-98a13e027b9f	Les Marteaux (x3) – Exécuteurs du conseil d'acier	Actions\nChaîne d’acier : entrave (FOR DD 13)\nMassue : 1d8+3\nRéaction – Interception : protège un allié adjacent	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	fed68392-d8e5-4a62-8b23-b12296f6519d	\N	\N	CRIMINALITE	{COMMUN,ARGOT_VOLEUR}	\N	f	14	45	f
7decf0c5-b84f-4a4b-b666-c9d820a104dc	Aegeard Blanks	Logisticien du Syndicat\n\nAegeard est un homme costaud d’environ 1,70 m, au visage rond marqué par les excès. Ses cheveux blonds, courts et bouclés, encadrent une très courte barbe en van dyke soigneusement entretenue. Ses yeux dorés, vifs et méfiants, observent sans cesse la salle. Sa peau blanche et rugueuse trahit une vie passée à encaisser coups et responsabilités.\nIl porte une tunique ample bleu foncé et un pantalon marron, pratique et taché.\n Aegeard parle peu, sert vite, et n’oublie jamais un visage. On dit qu’il sait exactement qui appartient au Syndicat… et qui n’y survivra pas longtemps.\n\nTraits\nSolide comme le Comptoir : résistance aux dégâts contondants.\nCoup de Pression : une créature touchée a désavantage à sa prochaine attaque.\nActions\nGourdin de taverne : +6, 1d8+3\nProjection : test de FOR opposé → à terre\n	\N	16	10	16	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	MAN	\N	{ARGOT_VOLEUR,COMMUN}	\N	f	14	60	f
d45b4ef2-160c-4676-bdf4-cefd20ae05b3	Vyn Keller	Vyn Keller est un homme rond d’1,70 m, au visage nerveux et souvent crispé. Ses cheveux blancs très longs et ondulés, rasés sur le côté gauche, lui donnent une allure singulière. Ses yeux bleus, toujours en mouvement, surveillent la salle avec inquiétude. Sa peau bronzée et rugueuse témoigne d’années de travail ingrat.\nIl porte une tunique brune et un pantalon gris.\n Vyn se déplace rapidement entre les tables, évite les regards trop insistants et obéit au moindre signe d’Aegeard. Il sait trop de choses… et fait tout pour ne jamais en dire trop.	\N	10	17	10	10	14	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	MAN	CRIMINALITE	{COMMUN,ARGOT_VOLEUR}	\N	f	15	38	f
7411def3-6e81-4808-96ef-b66596714505	Raskel “Langue-Cendre”	Chef de Cellule\n\nJets de sauvegarde DEX +7, CHA +6\nCompétences Tromperie +7, Persuasion +7, Discrétion +7, Perception +4\n\n\nTraits\nMaître des Faux : avantage aux tests de contrefaçon, faux documents, sceaux.\nOrdre du Syndicat (Recharge 5–6) : 2 alliés visibles peuvent se déplacer OU attaquer en réaction.\nFuite Préparée : quand il tombe sous 30 PV, Raskel peut Désengager + se déplacer sans provoquer d’AO (1/jour).\nActions\nMultiattaque (rapière + dague)\nRapière : +7, 1d8+5 perforant\nDague cachée : +7, 1d4+5\nSable aveuglant (1/jour) : cône 4,5 m, CON DD 14 ou Aveuglé jusqu’à fin du prochain tour.\n	\N	10	18	16	15	12	15	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	MAN	CRIMINALITE	{COMMUN,ARGOT_VOLEUR,ELFIQUE,HALFELIN}	\N	f	15	82	f
565621ae-f39c-4560-94ad-891be02bd351	Elivara Tanis	Grande prêtresse Tal Odius	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	RELIGEUX	{COMMUN}	\N	f	\N	\N	t
064a25ac-bf0a-45d0-92ae-917a3eb3283b	Darven Krest	Capitaine garde impériale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	MILITAIRE	{COMMUN}	\N	f	\N	\N	t
398fdec4-8c8e-45cb-bf14-21ecc801b24e	Hirvel Soran	Consortium de l'Ardoise	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	MARCHAND	{COMMUN}	\N	f	\N	\N	t
7b373f73-d08e-433d-90f9-973638debb08	Arienna Zandris	Fonderie Lumiforge	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
ff302943-8f32-4e85-9b57-c4613a0b8b09	Rhendom Kinemor	Famille royale Kinemor\n\nÉpoux Taripica (doc).	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
ac73eee3-4844-4da5-acb9-9b01d92162a7	Lysa “Cendre-rose”	Âge apparent : 25 ans\nApparence\nLysa est une femme élancée à la peau pâle constellée de petites cicatrices fines, vestiges d’une vie rude. Ses cheveux roux sombres tombent en vagues désordonnées sur ses épaules. Ses yeux gris, perçants, donnent l’impression qu’elle voit bien plus que ce qu’elle laisse paraître.Elle porte souvent des robes simples mais ouvertes, dans des tons rouges fanés, soigneusement entretenues malgré la misère ambiante.\n\nPersonnalité\nCalme, ironique, rarement surprise. Lysa parle peu mais écoute beaucoup. Elle a développé un talent certain pour retenir les secrets de ses clients… et pour les monnayer intelligemment.\n\nRôle dans le jeu\nInformateur discret pour les PJ\nPeut connaître les allées et venues du Syndicat\nCache parfois des objets pour certains clients\nPeut demander protection en échange d’informations sensibles\n	\N	10	10	10	10	10	10	\N	57171985-dade-4fcc-a00b-c06de058c7d6	6a3f2770-8383-4464-b840-90386200965c	HUMAIN	WOMAN	CRIMINALITE	{COMMUN,ARGOT_VOLEUR,HALFELIN,GNOME,ELFIQUE,NAIN,ORC}	\N	f	\N	\N	f
1187da10-69ed-4279-ace7-7835a67a551a	Pelfort Vanguard	Roi	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
b9770181-3cd9-4833-9c40-af5075f11862	Guetel	Reine	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
885e8784-80de-4a10-b09b-e7f75e3f114b	Ékénon Tracx	Capitaine de la garde (tieffelin)	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	\N	MILITAIRE	{COMMUN}	\N	f	\N	\N	t
18c38b2d-c41a-4703-80b5-3f4fd4c1dfac	Lierin Lorial	Prévôt bancaire	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
64d43c26-1baf-4d0d-809c-af184e30eac7	Faith	Meneuse du Syndicat / Alliance des Veines	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	\N	CRIMINALITE	{COMMUN}	\N	f	\N	\N	t
5e200bc9-a7ad-4da4-ad06-4d7f7aa936ef	Rany Mullimax	Conseil d'Acier	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
88a7345e-c964-4aa9-8510-770ffbe03494	Jillian Riverpipe	Courtière	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
56929e8b-b74f-4460-b7b9-851b98449237	Aimon Ivelis	Famille dirigeante	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
83c44434-de64-4102-a7b7-7fdf3a44d36d	Sana Ivelis	Famille dirigeante	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
cb838b2f-afc7-4e74-b105-2ccdb33e6bdb	Volodar Ivelis	Famille dirigeante	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
416c8c3e-d99c-4af9-b3e1-def8cf141d29	Akkar Ivelis	\N	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
48a75c4f-2ecb-4b21-a789-713e583e4c14	Ilrune Ivelis	\N	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
125faf06-5315-4081-85a6-c07d0de5bd23	Galya Ivelis	\N	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
9c9071e4-660c-4a05-8db9-f682cf806b0b	Keerla Ivelis	\N	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
1aa20150-7156-4743-929f-9b692acc4e87	Lierin Lorial	Dirigeant Frappe Brillante	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	MARCHAND	{COMMUN}	\N	f	\N	\N	t
fd7729da-641a-4a55-a4b2-db52c8cfa70e	Ery Seel	Assistant Frappe Brillante	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	MARCHAND	{COMMUN}	\N	f	\N	\N	t
ea5a6736-3483-4276-b508-a9fc5a764c0b	Faith	Alliance des Veines	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
9f64908e-8fa8-413f-b22c-b56c780d838e	Jillian Riverpipe	Alliance des Veines	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
d67aeebf-fe10-4095-b398-72ff920916c6	Rany Mullimax	Voiliers d'Éther	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
8b19726c-9dbd-4f52-b4a0-283a16544aae	Ernil Sultaasar	Aubergiste du Monocle du Diable	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
6619a997-be47-4f29-9b38-49099caaec2f	Melrilvaethor Quifaren	Serveuse (demi-elfe)	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
49906b5a-7730-4311-97b2-b328d8ac41ac	Vael Korshen	Stratège Conseil d'Acier / Œil Pourpre	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
79b9de26-b2df-480e-ab6d-c18694c9a6f3	Brakk « l'Enclume »	Arène illicite (demi-orc)	\N	10	10	10	10	10	10	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
3ff68dd6-93bd-4c05-a486-f63cb742935e	David IV	Monarque	\N	10	10	10	10	10	10	b7e4c389-c493-496f-b0d8-6245e5a940ea	2e83140f-4098-47f5-9bb5-c5aef481b976	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
b40b0791-d880-4dfd-8de2-51fdd8a626b6	Geani	Épouse de David IV	\N	10	10	10	10	10	10	b7e4c389-c493-496f-b0d8-6245e5a940ea	2e83140f-4098-47f5-9bb5-c5aef481b976	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
410a490f-a856-4f7d-bd16-f5487a3a7d87	Aedran Elvaltis	Gouverneur	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
5f6dc1c0-442e-471a-9b64-018d6a2576c5	Nyssara Elvaltis	Épouse ; Ral Nagor	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	RELIGEUX	{COMMUN}	\N	f	\N	\N	t
f20a199b-9864-46bc-9773-8f00d021be0a	Maeltor Elvaltis	Héritier	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
435d48c9-26cb-43b9-9d21-1af6fd1a873f	Lyris Elvaltis	Fille cadette	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
6a2db9ac-4609-4612-99a3-5ac4ef07cef7	Taripica	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
f78434f9-9757-4089-b49d-2b61e8616303	Calison	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
69c6ef2f-48d8-43e2-a984-ed344e578352	Norima	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
42f485ff-2400-4127-a1d1-23d4019cc21b	Limor	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
378aa9de-f8bf-481b-bca9-2dc42bb5c05d	Lauc	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
0520cf53-4096-4ff5-afe0-af707e3f8282	Tenabis	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
86e9b5f1-e4de-4c2b-9350-5e7c0a5c2065	Alménia	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
7b0679a6-8fd2-43a2-b7dc-e65eb6334cef	Ymal	Famille royale	\N	10	10	10	10	10	10	0853ab51-158a-4719-90c4-f705eb4f2b7f	a52c50ca-10f3-493f-877b-13fc5f989fda	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
7154f346-6dae-42bd-a768-a6b3ac54c5bc	Tonur Elurra	Roi Tonur XVII ; clan Elurra (drakéide)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
1c0882ff-e9c5-4326-9ee8-9b36049c69ea	Erlea Gerlaria	Reine (décédée dans doc)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
0faeab92-8111-4d00-983d-ce7124f1f6c4	Skorri Elurra	\N	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
edbaba13-4294-4842-b73c-2f1f4b73dd8f	Ornolf Elurra	Captif	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
9d4af2ec-f0c0-461f-9544-6b6239ea69b6	Aner Elurra	\N	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
b1002fad-2c80-436b-a67e-4e73b33cafe7	Asdis Elurra	\N	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
cf748374-1bfb-495b-864f-8df3f4295277	Esebio Tomasio	Comte des Dolomites (occupant)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
1e997704-5ea2-410e-8fe9-57794155d45c	Belina Tomasio	\N	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
70ec3e88-19f2-4b45-9f1a-a6cf0e424b82	Ivano Tomasio	\N	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
4e6b0b0a-cc09-4a0d-8d36-a1bd81f939df	Vanessa Tomasio	Jumelle	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
eb754905-eff3-459c-a048-5e384c88b939	Vanda Tomasio	Jumelle	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
604c2fbb-7b71-4ec7-bcbc-42e12e1739fe	Ennio Tomasio	Bébé	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
22324bca-09e0-43b1-a2cc-6ffd0a95294b	Taral de l'Est	Garde du corps des jumelles (guerrier)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	MILITAIRE	{COMMUN}	\N	f	\N	\N	t
8f0d2f03-64bd-4445-8e71-260d39625898	Ayas Sarwens	Directeur Nécrole	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
017dfd45-743c-49d6-aa30-1b726964a997	Malriho Uzuth	Professeur (drow)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
9284c06d-ac76-498a-a22d-acc0420ccf29	Afa NoirMarée	Professeur (génasi terre)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
05005da9-5e62-40fa-9f80-3b8a909c6976	Vedast Bolger	Professeur (halfelin)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
5b396dc0-a9cb-459e-b367-0adc2c25d393	Immiq Ammi	Professeur (tieffelin)	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
c1642ce3-2bc3-4921-94bd-7b35dba44029	Norgac Delsarane	Administratif	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
461dfe05-50cc-4a0f-b826-5227ecef87e2	Fulrad Longue-Rivière	C.C.C.H directeur	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
1c9db230-030a-42b0-89c2-62ebbe095abd	Gilly FortPied	C.C.C.H opérations	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
9c6db340-1204-4315-9480-29424d7b5ef3	Snakha	Syndicat / Conseil d'Acier île	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	CRIMINALITE	{COMMUN}	\N	f	\N	\N	t
498fe191-41ce-4460-96b6-8bedb97b2ae4	Zulban GardeBarbe	Mage proche Snakha	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
e3d3bf00-ab94-4687-804f-631bcdb4fdc5	ForteGriffe	Garde du corps Snakha	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	MILITAIRE	{COMMUN}	\N	f	\N	\N	t
00f1a34d-f19c-4166-8358-dab613152262	Triosz	Assassin Conseil d'Acier	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	\N	MILITAIRE	{COMMUN}	\N	f	\N	\N	t
a9cf5357-ea4f-4e3d-a9f8-3cf93537999f	Sheli doxe	Maire	\N	10	10	10	10	10	10	93bae9c3-0145-4431-968d-96534b04b8f3	ac8e7c66-c368-4c05-a15a-f6faa41647f8	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
9f6cbebf-5beb-4646-bdb3-effd7579001f	Symma Turen	Archimage	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	e6538773-eeba-4fd0-90b9-e3597c9738ed	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
3ac3ce66-b714-4d75-b16d-5c50de3f9d63	Qualen Pilwicken	Archimage	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	3df2a5ac-e15a-45d9-a1fd-cd755b855bb0	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
10ee53f4-ad08-4290-a61a-671be30bd140	Bilbron Nucklestamp	Archimage	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	e79e83d8-8e67-4511-a3f0-14911ea12b93	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
05c8cd3f-6d40-4fc7-a0a2-54325582ea60	Akara (clan Thrahak)	Œil Pourpre — Cavalier 2\n\nNaine	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	e6538773-eeba-4fd0-90b9-e3597c9738ed	\N	NAIN	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
235535c8-aaef-49e0-9363-7151c602e107	Cumpen Horcus	Œil Pourpre — Fou 2\n\nGnome	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	e6538773-eeba-4fd0-90b9-e3597c9738ed	\N	GNOME	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
872008bd-56c8-4c1c-9449-e7a5bf65924a	Frouse Fiddlefen	Œil Pourpre — pion\n\nGnome	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	e6538773-eeba-4fd0-90b9-e3597c9738ed	\N	GNOME	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
b49678fc-5e93-4615-a825-052d3dcff871	Boddynock Folkor	Œil Pourpre — pion\n\nGnome	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	e6538773-eeba-4fd0-90b9-e3597c9738ed	\N	GNOME	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
15e5f194-3bb1-4cf0-a908-be9bbb3173db	Kerrhylon Fax	Œil Pourpre — Tours 2\n\nDrakéide	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	3df2a5ac-e15a-45d9-a1fd-cd755b855bb0	\N	DRAKEIDE	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
7a25c962-9a00-4823-8c1f-97310b9f9a43	Aurore Grandpont	Œil Pourpre — pion\n\nHumaine	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	3df2a5ac-e15a-45d9-a1fd-cd755b855bb0	\N	HUMAIN	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
33d4a208-5507-42ea-bd84-bff40abcf225	Crampernap Scheppen	Œil Pourpre — pion\n\nGnome	\N	10	10	10	10	10	10	ac22e46a-65f4-440b-a76a-48078bae1167	3df2a5ac-e15a-45d9-a1fd-cd755b855bb0	\N	GNOME	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
beddeff6-3707-4611-88e7-0d2433576c28	Alym	Sultan (titre doc)	\N	10	10	10	10	10	10	a6de5bfd-20a6-419b-9226-3e5697c788e7	5ea76c42-f49b-4b66-8d6e-bf914ef8018d	\N	\N	\N	POLITIC	{COMMUN}	\N	f	\N	\N	t
d02c6b35-6b00-4246-aae6-19e1ca3d1b95	Moite le juste	Souverain (mention postérieure doc)\n\nÀ réconcilier avec Alym dans tes notes MJ.	\N	10	10	10	10	10	10	a6de5bfd-20a6-419b-9226-3e5697c788e7	5ea76c42-f49b-4b66-8d6e-bf914ef8018d	\N	\N	\N	OTHER	{COMMUN}	\N	f	\N	\N	t
\.


--
-- Data for Name: Place; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Place" (id, name, description, "kingdomId", "cityId", "iconUrl", "districtId", "isForDM", map, "showOnMap") FROM stdin;
af873b6b-d45d-492e-a62a-5c9ba30d6852	Brasserie la Plume	(taverne bruyante)\n\nLe bâtiment en forme de L est composé d'un rez-de-chaussée et de deux étages, la pièce principale a été récemment rénovée. Au rez-de-chaussée, se trouve une salle pouvant contenir au maximum 20 personnes. Au devant de l'auberge, quelques tables et chaises permettent de prendre un verre à l'extérieur. A l'étage se trouvent les chambres, avec un minimum de commodité, avec un verrou qui permet de fermer la porte. Au deuxiéme étage se trouve d'autres chambres plus spacieuses pouvant accueillir un couple, la porte se ferme avec un verrou solide.\nDans cet établissement viennent souvent des voyageurs cherchant une escorte, de plus la proximité d'un temple d'une divinité bonne, amène souvent de braves gens.\n\nServices disponibles :\nchambre : 8 pièces avec des commodités agréables\nécuyer : 1 - qui prendra soin des pièces d'armures et des armes	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	7402f449-7ae2-461d-9981-e45c942f169f	f	\N	t
909d7a50-2e47-47e5-94dd-dc5b8f9a52e1	la Mésange Fringante	(fréquentée principalement par une race spécifique Nain)\n\nLe bâtiment en forme de H est composé d'un unique rez-de-chaussée, la construction est correcte. A l'intérieur, se trouve une salle pouvant contenir 30 personnes. Au devant de l'auberge, quelques tables et chaises permettent de prendre un verre à l'extérieur.\nDans cet établissement viennent souvent des voyageurs cherchant une escorte, de plus la proximité d'un temple d'une divinité bonne, amène souvent de braves gens.\n\nServices disponibles :\nchambre : 3 pièces avec des commodités agréables\npalefrenier : 1 - soignera et nourrira les chevaux convenablement\nsoigneur : 1 - pouvant lancer des sorts de soins faibles\nrations sèches : permettant de se sustenter durant les longs voyages\nbarbier : 1 - exécute son travail convenablement\nbarde : 1 - pour quelques piécettes, chante	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	118b0713-e8c3-4dec-ad03-ba76cfe63900	f	\N	t
a01e87b0-94ca-42ed-9371-f5a5d4a411bb	L'Oracle du vin	(taverne aristocrate)\n\nL'Oracle du vin est une taverne tranquille et accueillante. À travers les murs peints, on peut entendre des rires.\nEn ouvrant la lourde porte de la taverne, on est accueilli par l'odeur du pain frais et par un petit groupe de clients. L'intérieur semble tout aussi accueillant que l'extérieur. La pièce est éclairée par un lustre magique suspendu au plafond. Derrière le bar en marbre se tient un gnome des rochers maigre de 1,80 m, au visage nerveux, aux cheveux bruns très longs et raides, aux yeux bleus et à la peau douce et bronzée. Il porte une tunique bronzée et un pantalon blanc.\nEntre vous et le barman se trouve une série de tables bien conçues, à droite un foyer avec une flamme rugissante à l'intérieur, et à gauche un long escalier.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	0a070760-36fd-43de-9b3f-5be9b9c52c41	f	\N	t
74e17574-3460-4e45-bd2a-4036efa72359	Le bois du deuil	Le bois du deuil (taverne calme (pleins d'écrivain))\nVous vous approchez d'une taverne calme et accueillante. À travers les murs de briques, vous entendez des coups de marteau. Sur le côté gauche du bâtiment se trouve une modeste écurie avec une petite collection de chevaux.\nLorsque vous ouvrez la porte de la taverne, vous êtes accueillis par un petit groupe de clients. L'intérieur semble tout aussi accueillant que l'extérieur. Une faible lumière de bougie éclaire la pièce et derrière le bar en bois poli se tient un nain des collines costaud de 4'9" au visage oblong, aux cheveux auburn extrêmement longs et raides, à la barbe moyenne, aux yeux bruns et à la peau blanche et douce. Il porte une belle chemise grise et un pantalon ample jaune.\nEntre vous et le barman se trouve une série de tables hautes en bois robuste, à droite un foyer avec une flamme rugissante à l'intérieur, et à gauche un escalier en pierre.	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	a118cdca-1dd1-448f-9729-b688fe5b87ef	f	\N	t
fed68392-d8e5-4a62-8b23-b12296f6519d	Le Monocle du Diable	\nUne réputation dangereuse\n\nLe Monocle du Mage est tristement célèbre à Huriya.\n C’est une taverne bruyante, violente et chaotique, connue pour être un repaire officieux du Conseil d’Acier. Les discussions y sont rarement innocentes, et les alliances se font et se défont autour d’une chope.\nSous la taverne se trouve une arène de combat illicite.\n Les combats y sont brutaux, souvent à mains nues, parfois à l’arme blanche, et toujours illégaux. Les paris y circulent librement, tout comme l’argent sale.\n\nLe Monocle du Diable est une taverne massive, bâtie en briques de pierre sombre, dont les murs épais gardent la chaleur comme un four. À l’extérieur déjà, l’air semble lourd, chargé d’odeurs de fumée, de sueur et d’alcool épicé.\nLorsque vous poussez la porte parfaitement lisse, polie jusqu’à en devenir presque étrange au toucher, une vague de bruit et de chaleur vous frappe immédiatement.\nÀ l’intérieur, la salle principale est bondée. Les conversations se superposent en un brouhaha constant, ponctué de rires gras, d’altercations à demi-voix et du choc régulier de chopes de métal. L’air est épais, presque étouffant, saturé de fumée, de bière forte et de graisse rance.\nUn lustre lourd, suspendu au plafond par une chaîne épaisse, diffuse une lumière jaune et tremblotante. Les flammes des bougies qu’il supporte projettent des ombres mouvantes sur les murs de pierre, donnant à la pièce un aspect instable, presque vivant.\nDerrière le bar en bois poli, usé par des années de coudes appuyés et de coups de poing, se tient Ernil Sultaasar.\nL’aubergiste est un elfe des bois costaud, d’environ un mètre soixante-dix. Son visage carré, marqué par une mâchoire solide, contraste avec la finesse attendue de son peuple. Ses très longs cheveux bruns et bouclés, souvent attachés à la va-vite, tombent dans son dos. Ses yeux bruns, attentifs et calculateurs, scrutent constamment la salle. Sa peau lisse et dorée brille légèrement sous la chaleur du lieu. Il porte une tunique marron sale et un pantalon gris ample, pratiques et sans fioritures.\nErnil sert rapidement, parle peu, mais voit tout. Rien ne se passe dans sa taverne sans qu’il en soit au courant.\nEntre vous et le bar se trouvent plusieurs tables hautes en bois robuste, épaisses, lourdes, visiblement conçues pour résister aux bagarres fréquentes. Les chaises sont rares : ici, on boit debout, prêt à bouger ou à frapper.\nSur la gauche, un foyer massif est encastré dans le mur. Une flamme rugissante y brûle en permanence, alimentée par des bûches épaisses. La chaleur qu’il dégage est presque excessive, mais personne ne semble s’en plaindre.\nÀ droite, un escalier de pierre descend vers les niveaux inférieurs. Il est étroit, usé par le passage, et souvent gardé par deux habitués silencieux. De là-bas montent parfois des clameurs étouffées, des cris de victoire ou de douleur, et le bruit sourd de coups portés.\n\n🩸 L’Arène du Monocle\nSituée sous la taverne.\nCercle de pierre noircie.\nGrilles d’acier rouillées.\nSable mêlé de sang séché.\nBalcon fermé pour les parieurs “importants”.\n\nTypes de combats :\nCombat à mains nues\nDuel armé\nCombat contre bêtes\n“Épreuve d’endurance” (jusqu’à la mort)\nLes vainqueurs reçoivent de l’or.\nLes perdants deviennent parfois… des dettes vivantes.\n\nPLAN DÉTAILLÉ – ARÈNE & SOUS-SOLS DU MONOCLE\nNIVEAU -1 : SOUS-SOLS\n[ A ] Salle des paris\n  |\n[ B ] Couloir gardé —— [ C ] Cellules\n  |\n[ D ] Vestiaires —— [ E ] Armurerie\n  |\n[ F ] Escalier vers arène\nA – Salle des Paris\nTables, coffres, registre codé\n2 affiliés + 1 Marteau\nC – Cellules\nPrisonniers\nUn tunnel effondré (sortie possible)\nE – Armurerie\nArmes illégales\nMarquage du Conseil d’Acier\n\nNIVEAU -2 : L’ARÈNE\n      [ Balcon VIP ]\n        |         |\n[ Loge ]—[ ARÈNE ]—[ Loge ]\n        |\n   [ Salle rituelle ]\n\nArène\nCercle de pierre\nGrilles d’acier\nTerrain difficile (sable + sang)\nBalcon VIP\nVael observe parfois ici\nRideaux, gardes discrets\nSalle rituelle\nUtilisée pour “finir” les combattants\nSymboles gravés dans la pierre\n	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	1698f8f1-2c6a-468a-a602-125f47e6bdb4	f	\N	t
6a3f2770-8383-4464-b840-90386200965c	La Salamandre Savoureuse	La Salamandre Savoureuse est une taverne miteuse, tapageuse et poisseuse, dont la réputation dépasse largement son quartier. Bien avant d’en pousser la porte, on entend déjà des éclats de voix, des rires rauques et le bruit sourd de coups de poing frappant chairs et tables.\nLe bâtiment est bas, construit en pierres grossières mal jointées, recouvertes d’une peinture écaillée aux teintes indéfinissables.\n À l’avant, un porche en gravier s’étend sous un auvent de tissu élimé, troué à plusieurs endroits. Quelques bancs branlants y servent autant de lieu d’attente que de ring improvisé pour régler des différends mineurs.\nSur le côté droit, une écurie mal entretenue accueille un nombre modéré de chevaux. Les stalles sont sales, l’odeur âcre de fumier se mêle à celle de l’alcool renversé. Certains chevaux portent des marques douteuses, signe qu’ils n’ont peut-être pas été acquis légalement.\n\nÀ l’intérieur\nLorsque vous ouvrez la porte, une chaleur lourde et humide vous enveloppe aussitôt. L’air est saturé de sueur, d’alcool bon marché et de parfums trop forts. La salle est bondée, remplie d’individus aux regards durs et aux mains calleuses.\nL’intérieur est à l’image de l’extérieur : sale, bruyant, vivant.\n Les murs sont couverts de taches, de graffiti grossiers et de marques de lames. Le sol colle légèrement sous les bottes.\nDerrière un bar en bois taché, rongé par l’alcool et les années, se tient Aegeard Blanks.\n\nEntre vous et le bar se trouvent plusieurs tables hautes en bois, épaisses, rayées, parfois fendues. Certaines portent encore des traces brunâtres qui ne sont pas toutes dues au vin.\nÀ droite, un foyer bas contient un lit de braises rougeoyantes, entretenu en permanence. Il ne sert pas tant à réchauffer la pièce qu’à y maintenir une chaleur étouffante… et à faire disparaître discrètement certaines preuves.\nÀ gauche, un vieil escalier grinçant monte vers les étages supérieurs. Chaque marche proteste bruyamment, comme si elle avertissait ceux d’en haut qu’un visiteur arrive.\n\nLes prostituées travaillent principalement à l’étage, dans les chambres I et J du plan.\nElles sont surveillées, mais pas constamment, ce qui laisse place à :\ndes échanges discrets avec les PJ\ndes intrigues humaines\ndes choix moraux intéressants\n\n\n\nUne double nature :\n\nOfficiellement, la Salamandre Savoureuse est une taverne populaire et misérable.\n En réalité, elle sert aussi de maison de passe bon marché, où les chambres à l’étage accueillent clients et affaires louches à toute heure.\nMais surtout, la taverne est un repaire du Syndicat.\nIci :\nse négocient des vols\nse revendent des marchandises contrefaites\nse planquent des objets volés\net se recrutent des petites mains jetables\nChaque cellule du Syndicat étant autonome, la Salamandre fonctionne comme un nœud local, discret mais essentiel.\n\nAmbiance générale\nLa Salamandre Savoureuse est un lieu où :\nla violence est banale\nla morale est absente\nla loi ne franchit pas la porte\net où l’or circule plus vite que les vérités\nUn endroit idéal pour :\ntrouver un contact criminel\nvendre un objet volé\ndisparaître quelques jours\nou déclencher une bagarre qui dégénère\n\nPLAN DE LA SALAMANDRE SAVOUREUSE\n(taverne + maison de passe + repaire du Syndicat)\n🔻 REZ-DE-CHAUSSÉE — SALLE COMMUNE\n┌──────────────────────────────┐\n│ [A] Porche / Entrée          │\n│                              │\n│ [B] Tables hautes (bastons)  │\n│                              │\n│ [C] Bar (Aegeard)            │\n│                              │\n│ [D] Foyer / Braises          │\n│                              │\n│ [E] Escalier grinçant ↑      │\n│                              │\n│ [F] Porte arrière → Écurie   │\n└──────────────────────────────┘\nPoints notables\nB – Tables : terrain difficile si combat (chaises, alcool renversé).\nD – Foyer : braises utilisables comme arme improvisée.\nF – Porte arrière : sortie rapide vers l’écurie → fuite fréquente du Syndicat.\n\n🐎 ÉCURIE (EXTÉRIEUR, CÔTÉ DROIT)\n┌───────────────┐\n│ Stalles x6    │\n│               │\n│ [G] Remise    │\n│ (objets volés)│\n└───────────────┘\nG – Remise verrouillée (DD 13)\n → faux sacs de grain\n → cache d’objets contrefaits\n → chevaux volés ou maquillés\n🪜 ÉTAGE 1 — CHAMBRES & PASSE\n┌──────────────────────────────┐\n│ [H] Palier / Garde           │\n│ [I] Chambre 1 (clients)      │\n│ [J] Chambre 2 (clients)      │\n│ [K] Chambre “privée”         │\n│ (réunions du Syndicat)       │\n│                              │\n│ [L] Escalier ↓ secret        │\n└──────────────────────────────┘\nDétails\nI & J : chambres sales, rideaux épais, alcôves.\nK – Chambre privée\nTable, cartes, faux sceaux\nRegistre codé du Syndicat\nL – Escalier secret → sous-sol\n🔒 SOUS-SOL — CAVE DU SYNDICAT\n┌──────────────────────────────┐\n│ [M] Salle de stockage        │\n│                              │\n│ [N] Atelier contrefaçon      │\n│                              │\n│ [O] Cellule / Silence        │\n│                              │\n│ [P] Tunnel effondré          │\n│ (ancienne sortie)            │\n└──────────────────────────────┘\nN – Atelier : matrices, moules, fausses monnaies, faux documents\nO – Cellule : prison courte durée / interrogatoires\nP – Tunnel : praticable pour une fuite lente\n\n\n	\N	57171985-dade-4fcc-a00b-c06de058c7d6	/Icon/place.png	60772e14-0028-4c5e-9411-f8ddf8a6c03b	f	\N	f
99faeb14-73a1-44c0-8fe7-e3144b2ac04d	Château de Verre	Type (lore) : palais.	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	f	\N	t
2a3adec9-01af-462d-b681-6b8f9e45b81e	Géodes Pourprées	Type (lore) : carrière.	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	f	\N	t
e58be3b4-b8d0-401a-ab24-ba4c8d8e77cd	Arène du Goulet Écarlate	Type (lore) : arene.	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	f	\N	t
fbb0add1-82e7-44d1-b68f-63506bc24ca3	Palais des Ententes	Type (lore) : diplomatie.	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	f	\N	t
7b236f93-0af6-4a63-8068-a9585e3251a6	Grande arène de Huriya	Type (lore) : arene.	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	f	\N	t
a4e7aa66-aa65-4459-aca1-b3d2114359cf	Le Monocle du Diable	Type (lore) : taverne.	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	f	\N	t
ad6dfe9d-e524-4274-9683-e528e4034e72	La Frappe Brillante	Type (lore) : fonderie.	4226ee30-e8a9-4817-910c-47baff2a7f2b	d8c2ee3e-f123-4338-872f-72ada526811e	\N	\N	f	\N	t
c061f772-bfcb-41f4-be1d-01fa653cfb06	Temple scellé de Tal Aesir	Type (lore) : temple.\n\nSous le Château de Verre (lore).	4226ee30-e8a9-4817-910c-47baff2a7f2b	55787c45-48b6-441b-b551-1ef3c3825a08	\N	\N	f	\N	t
17a3d98b-2d91-499f-8096-439d6b810ce8	Sanctuaire au dragon (montagne taillée)	Type (lore) : temple.	93bae9c3-0145-4431-968d-96534b04b8f3	\N	\N	\N	f	\N	t
27cdab7a-825e-43de-981a-bb35e63a89cb	Les Cendres	Type (lore) : site-mémoriel.\n\nCratère bombe gnome.	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	f	\N	t
04121a12-f155-4a1f-90ec-b72563c75507	Palais du comte Esebio	Type (lore) : palais.	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	f	\N	t
0f84db1e-eeb4-467c-bfd6-ae5e83abbdf8	École de nécromancie (sous Les trois cafards)	Type (lore) : ecole.	93bae9c3-0145-4431-968d-96534b04b8f3	c867f929-58f0-4918-98b4-f6eab7e78bfa	\N	\N	f	\N	t
e9d76adb-bf27-4921-9b83-074d2ad638b7	Palais d'Elvaltis	Type (lore) : palais.	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	f	\N	t
3d31ebcc-3bf3-40f7-b2e5-44f00c86da88	Temple de Tal Odius (Kalanos)	Type (lore) : temple.	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	f	\N	t
abff3ad5-1cd9-463d-bb86-5e59306bc71d	Carrières de l'Ardoise Blanche	Type (lore) : carrière.	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	f	\N	t
503b345e-650c-49d4-84e2-5289c7e9f69b	La Halte Éthérée	Type (lore) : ruines.	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	f	\N	t
83be24e6-483c-4bad-bd86-63a9e9f34379	Le Bourbier des Errants	Type (lore) : bidonville-souterrain.	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	f	\N	t
2f181951-ec63-4895-b33e-1e2303722d53	Les Abysses Murmurants	Type (lore) : ruines.	0853ab51-158a-4719-90c4-f705eb4f2b7f	61055654-0579-4a5b-9e2c-eed4452c7922	\N	\N	f	\N	t
bfde5ec7-ff0d-418a-b3ba-85a60b40666f	Temple Noir (école enchantement)	Type (lore) : ecole.	ac22e46a-65f4-440b-a76a-48078bae1167	e6538773-eeba-4fd0-90b9-e3597c9738ed	\N	\N	f	\N	t
ae31c790-cdce-4e3b-baaa-9b680a52ff84	L'Étreinte du Vent	Type (lore) : organisation-lieu.\n\nGrande congrégation d'assassins fanatiques au sud (doc).	a6de5bfd-20a6-419b-9226-3e5697c788e7	\N	\N	\N	f	\N	t
\.


--
-- Data for Name: Position; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Position" (id, x, y, "kingdomId", "cityId", "placeId", "personOfInterestId") FROM stdin;
c36a3ad8-aff6-4829-a4d2-7946d31b9a2b	0.448551724137931	0.8113425925925926	\N	ec01895d-64a4-4687-8f2d-035f149904ed	\N	\N
68cedd30-235d-490d-bc0a-fdb463d22224	0.3147758620689655	0.5274160879629629	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N
c5430d76-e94e-41d1-bcc2-4b9a5a828dcc	0.4108965517241379	0.8666666666666667	\N	94a2fd1d-9a42-4b60-ba6e-865208b430c1	\N	\N
ae75863c-031d-4978-b363-ab3869290463	0.7183448275862069	0.4578703703703704	\N	b220665e-2800-44ce-84e0-b0f9313640ed	\N	\N
db0876f3-04c5-41fe-bbfe-2fcbf3871b15	0.3122758620689655	0.4416666666666667	\N	157a72f3-cc46-4430-8e4f-9ab0fefcf133	\N	\N
30f509a9-5b53-4e28-a998-90acacf976fe	0.4431724137931035	0.9243055555555556	\N	9c44080d-9577-4c58-9a2f-4b8111c491d2	\N	\N
afd00cc6-3a2f-4633-8219-4449dba1d986	0.4231724137931034	0.7944444444444444	\N	bdb2dcea-441e-4a99-9f75-200d554d88f6	\N	\N
8e54ad1f-c9c7-4794-a374-83e67c11f44f	0.3853793103448276	0.9474537037037037	\N	e270ac1d-4df4-4af9-bb2c-ed96865d3b12	\N	\N
9908eaae-78b7-4f02-aa06-1b03c3efb2ea	0.3310344827586207	0.9002314814814815	\N	d5c6a0ac-1cb8-47cb-b0fc-aa17fefc587e	\N	\N
163e0ea4-cec0-4e98-8faa-2317a99dbf8a	0.3987586206896552	0.7613425925925926	\N	5d0cc51f-c6ac-4036-ad03-7344efecb965	\N	\N
2677259d-1928-48a5-b127-dfdc1a3b971a	0.1059310344827586	0.525	44383b5f-5ed4-4ae8-91ac-2c377928206e	\N	\N	\N
4f63ae08-7f22-4074-8c5c-dbeab6813b59	0.5075862068965518	0.7638888888888888	\N	4de27113-8487-455c-ab37-d740d69d5619	\N	\N
84019ca9-e1c9-4668-8b37-3ac05edcdce9	0.3668965517241379	0.7261574074074074	\N	2580fe9d-e8a1-46f1-83c1-d33b26ed6863	\N	\N
09a2d22e-2567-4886-8af8-82b2b85f3908	0.7936551724137931	0.4412037037037037	\N	b35688a0-96ed-4416-82b9-19db566f7815	\N	\N
3c3dbf96-d1f9-42b8-97dd-d7465b30fc93	0.4797241379310345	0.7418981481481481	\N	2859a2c9-8ccc-4de5-a74e-4b8be15bb838	\N	\N
232267da-6927-4b9b-bf4d-eefda5d00d96	0.2168275862068965	0.8768518518518519	\N	3777dab0-1e36-491c-859a-fdc48062201b	\N	\N
3a15007b-6fb4-4100-b1d7-ff5c9dda4a4f	0.3337931034482758	0.6217592592592592	\N	b508926d-83a0-4372-92d7-2363aeade1f4	\N	\N
ae802ffe-9b9b-49f5-b5e4-d2ed21613011	0.2784827586206897	0.8619212962962963	\N	752d5094-7102-4a38-926a-cb814de89e27	\N	\N
f7e6214f-1c1b-4085-be20-a88cf9fabd9a	0.2424827586206897	0.7344907407407407	\N	6c33f828-7b6b-4890-95ce-0822caa1e807	\N	\N
a00caefd-8e1b-4a67-bf1c-da75f353ddad	0.4281379310344828	0.7196759259259259	\N	19e896ae-0b41-46ed-923f-825f43215b53	\N	\N
08f06166-475b-4985-95fd-29fde1415d07	0.1462068965517241	0.7087962962962963	\N	f4722f65-bb3e-400d-b818-260db1011f3a	\N	\N
7610e332-0ecf-498e-9e14-a58ae1a19030	0.32	0.7340277777777777	\N	c136e1cc-0f84-4729-b3e2-8dee3e6d46e1	\N	\N
c6449d08-2650-43bb-95ad-19b2dd05eee8	0.2504827586206896	0.9416666666666667	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	\N	\N	\N
6666bb19-4443-492b-8f9f-2db1d718f097	0.6670344827586207	0.4046296296296296	\N	c1e27b23-4188-4fdd-96df-9d9dba88833b	\N	\N
81310f03-4cc4-4a45-bd17-1ad196165f1c	0.4667586206896552	0.8930555555555556	\N	b6d0fb34-df10-41f9-ab7a-585402919c03	\N	\N
5a8bbd53-acac-4ee1-8361-f6d512df76fa	0.4579310344827586	0.8666666666666667	\N	da0f5b30-743d-422a-b281-9d276681f56f	\N	\N
7c10e3e6-aa41-478a-a8d1-88e4f9f8aebd	0.8684137931034482	0.6822916666666666	\N	7f0198e3-b293-4d8c-a7ed-0bd1b9120e17	\N	\N
36c6fd69-5226-46f2-af6b-c26c44944419	0.4772413793103448	0.8240740740740741	\N	19df6e53-8868-4511-8a58-39c9e3659c21	\N	\N
04b850ec-be4f-44fe-89cd-f93d53db4084	0.1713103448275862	0.3533564814814815	\N	e46962cc-2d61-423b-b3b8-e7466ffcd976	\N	\N
20bb159b-238d-453e-a80b-81373422e978	0.9313103448275862	0.3444444444444444	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	\N	\N	\N
49b00d1a-5338-4e83-89d1-fb3046fac8f4	0.3542068965517242	0.675	\N	bb93ab0c-8f81-430e-ac0b-16800b113e0e	\N	\N
196df31f-c103-4e46-96b2-dd680510e9f8	0.3382068965517241	0.8275462962962963	\N	181d1980-2ade-4c0d-bf44-4252e636dc6c	\N	\N
db84f3bc-5262-4741-9b74-b82b797d9e7e	0.263448275862069	0.5604166666666667	\N	295580b8-9df6-4209-9d2a-1d237144a69c	\N	\N
745c25d4-d3e7-4027-b91e-5cc53bfa86fe	0.2150344827586207	0.627199074074074	\N	7ccf7b24-0e5e-42e5-8493-76ee231c25ac	\N	\N
9ae59802-16d8-4ed6-a03e-02b754b1871a	0.1702068965517241	0.507175925925926	\N	96745fc0-6d7e-421c-a0a8-3bbb12b8f4c9	\N	\N
1f0bf2eb-9ccd-4454-9201-5f5e70018aa1	0.4057931034482758	0.3460648148148148	\N	ce3fb962-bb73-47f4-8e12-656c0af3f4a1	\N	\N
fd3d1db5-52bd-4220-9cde-0901c265b358	0.2162758620689655	0.4296296296296296	\N	3cd0ba8b-db9c-4cbe-83e9-49a515399cbb	\N	\N
933cfc0f-f396-409e-b1e6-89573e876e17	0.512551724137931	0.4611111111111111	\N	47119f73-bd40-4a59-b1c4-b8daf1b0eade	\N	\N
0747fc64-5be5-44ad-b6b0-9c5239ed20ae	0.1699310344827586	0.2601851851851852	\N	ce4ce8b9-77fd-4105-a0fb-ee5edb557a7c	\N	\N
2f172cb1-ddcb-441d-8e0a-e37d509cb404	0.2266206896551724	0.2872685185185185	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N
7c27c736-7e96-445d-b488-ce7e33ede435	0.4402758620689655	0.1759259259259259	cbf00301-c56a-4702-92b7-c5fa6013f99a	\N	\N	\N
2565403b-fad8-46de-80bd-61ae88007cfe	0.745448275862069	0.203125	\N	cfda6692-0df6-400e-b9df-6786da0f1d92	\N	\N
1c156fd8-2ac4-478d-b0b5-f9e206d65f9e	0.577103448275862	0.3598379629629629	\N	6b642f1f-70b8-4b37-ba14-9e3922efe3a8	\N	\N
b65abcae-c919-45e7-bcd2-b0a340be9bd6	0.4583448275862069	0.1431712962962963	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	\N
da1c12f8-2106-4ad5-b4b3-b241fb2ac0ce	0.4758620689655172	0.3893518518518518	\N	a602cacc-0d51-4334-a9e9-b54a7d60ac24	\N	\N
9adfeea4-355b-4fc5-807d-a781d529e90b	0.2987586206896552	0.3815972222222222	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N
e0a9a3ec-02df-4d41-9ddd-3a11b549d1f5	0.8339310344827586	0.3060185185185185	\N	d11ea82c-fc71-44f1-8d14-5ae423a31f83	\N	\N
167e3d3c-8c79-4dd3-a6cd-a8a1ae45cb40	0.7624827586206897	0.3148148148148148	\N	ac1ff1a0-087e-4400-8ce6-91337e238d24	\N	\N
1f1e6a0c-60e3-4d5d-9491-e144bb674b0a	0.7873103448275862	0.3947916666666667	\N	3c5962f4-339b-433a-b253-135a32db63f1	\N	\N
d2b06a26-e9cf-499e-9a4b-b68906424917	0.8557241379310345	0.6322916666666667	\N	0ff4ed2b-4048-4ce9-9ec3-1c617727895c	\N	\N
2fdf935e-0db6-406c-b51b-7d9ab0f9a7b7	0.6819310344827586	0.3199074074074074	\N	1ab001f3-e7d0-4cb2-a0ff-c6800549dc8d	\N	\N
d19da760-a091-454b-ab57-d98f772f806a	0.7335172413793103	0.3648148148148148	\N	aef53759-d6b9-4bca-bc2b-7aca5ffb2676	\N	\N
0682bb70-25ce-46be-9628-b093358903e4	0.634896551724138	0.349537037037037	\N	f410d0e6-ae0b-47b9-92d0-a91e1a0e65a0	\N	\N
327c97e1-e0a5-44b5-8049-2ebccc71181c	0.6510344827586206	0.2490740740740741	\N	42220881-20fd-4bc5-a818-d00cd79473b7	\N	\N
7c1b2560-5421-482b-9031-ff7349abea26	0.07062068965517242	0.2666666666666667	4d37eed1-161e-4156-970c-381793c3d614	\N	\N	\N
053d7be3-8040-400b-afe8-feffd93293ad	0.7536551724137931	0.53125	\N	7c205d43-f91b-46f1-8809-7e774090823f	\N	\N
65c5edc4-e816-4626-940c-0c8f29c730ee	0.6113103448275862	0.8074074074074075	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	\N	\N	\N
78820537-38ca-4571-ae7f-16471c63b042	0.3975172413793103	0.2523148148148148	\N	72589e8c-bbbe-43fe-bb68-c7be7fbe0347	\N	\N
63388216-6448-4f36-8572-9470e2258c11	0.353103448275862	0.1902777777777778	\N	bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	\N	\N
2c7b051a-69c3-44b2-afd2-9ac38b0b1481	0.2146206896551724	0.2018518518518519	\N	443543db-314f-472e-a899-3d42f34fdb5f	\N	\N
dad65cb7-8c3a-4fb3-8983-0da6b76aad82	0.5106206896551724	0.1988425925925926	\N	fd428152-24ae-4cf5-8239-ad928df9f930	\N	\N
1f16356e-abff-43c8-a441-00dad051ba4b	0.2819310344827586	0.6368055555555555	\N	899e1c2a-a99b-4eef-8e00-5657476b4a27	\N	\N
6d98cdb4-81cb-47c9-8cb8-a2d2476c79fb	0.3903448275862069	0.2972222222222222	\N	8d5a0617-0e82-4a8a-855f-582c1003805f	\N	\N
935e1465-d979-4c82-bad5-ef373fa02be5	0.5135862068965518	0.3028935185185185	\N	d52e5905-28b3-427a-b3ed-82a0d5646a9c	\N	\N
e107a1bc-ff67-47d8-b35a-8335e9808553	0.3259310344827586	0.2953703703703704	\N	42044469-437c-43d5-b1e3-41c4c6b18035	\N	\N
5ef71402-6ec7-4685-9e62-3e5e72bd3df4	0.3376551724137931	0.5935185185185186	\N	2c8c2982-7dfa-4be4-96e9-328c05473197	\N	\N
b821e95a-99e3-48a0-8673-1cfc5d940eea	0.3161379310344827	0.5236111111111111	\N	\N	\N	3511d7a5-70d7-4985-9012-a6682b351ce8
248a1d74-c87f-435e-a810-5b91c8bcfd5b	0.3155862068965517	0.5236111111111111	\N	\N	\N	a50188f9-724b-4ba6-b62b-0a1a0f43bf97
60fcc154-6a23-452c-8418-3c3e396eb930	0.4918620689655173	0.6366898148148148	\N	4f2eca99-0e4a-4039-a211-9509758b8de3	\N	\N
a4deecef-b374-4711-9311-17f5da21a19b	0.4153103448275862	0.6118055555555556	\N	3c456778-4811-4c35-8504-6af9803f8c5e	\N	\N
105103fd-d764-4fec-b673-f75a51b26662	0.3155862068965517	0.5231481481481481	\N	\N	\N	3ffea450-a1d7-4505-8008-5fd47e93abb5
27057312-3ac9-4476-aaf3-eea12d93b717	0.4847222222222222	0.4133333333333333	\N	\N	\N	88682d84-12ec-48fa-8ede-98a13e027b9f
d2d32195-df3c-4d1a-a722-8e625a3eba48	0.6344827586206897	0.6111111111111112	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	\N	\N
4f6e2727-661f-4fe9-91ab-24d91e199f63	0.4941944847605225	0.2708333333333334	\N	\N	\N	7decf0c5-b84f-4a4b-b666-c9d820a104dc
c34eb45e-adf3-4d76-a250-b0b83711fb57	0.5094339622641509	0.2608333333333334	\N	\N	\N	d45b4ef2-160c-4676-bdf4-cefd20ae05b3
878c6a74-3da2-4cbd-be98-c9c152a1f3e7	0.5776487663280117	0.1808333333333333	\N	\N	\N	7411def3-6e81-4808-96ef-b66596714505
253353ba-334d-4abf-b2cd-098e20a2bb66	0.512	0.4976851851851852	\N	264a9f82-fdc3-4667-bd60-439a2a89ab04	\N	\N
ea7e7111-3324-43cd-98fe-e33530348829	0.5674891146589259	0.1808333333333333	\N	\N	\N	5e8db395-6054-40e6-bd92-ef809166fa15
1ed5a5d3-0a6a-40ad-bb85-0fc4216333c3	0.5667634252539913	0.1758333333333333	\N	\N	\N	ac73eee3-4844-4da5-acb9-9b01d92162a7
4ca9c94a-fa3b-445f-b4d1-d6561019f805	0.5653120464441219	0.1708333333333333	\N	\N	\N	38e8071e-b2f2-4f88-ac70-4e3e80fd6f7d
e4e74407-cd96-4d61-bbd0-826a33b71204	0.4642758620689655	0.5560185185185185	\N	fce0576a-07d3-436d-a1be-2f7ea9ad34f2	\N	\N
ebdbcdf5-faf3-4f9c-830b-dc7ee325acd2	0.5412413793103448	0.5456018518518518	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N
98b30bf2-387a-4b58-910b-a83a3fc4b8fb	0.4783448275862069	0.6944444444444444	\N	388f3dfc-a23b-4cb4-8a38-4f15e36cdca6	\N	\N
bcef500b-19f3-43df-b027-1f2b8a397b28	0.334896551724138	0.4324074074074074	\N	e2d54173-58fe-4417-b763-e90fca60fd31	\N	\N
c1f3d85b-2edd-4246-9bb2-9c37adf620e1	0.4231724137931034	0.4578703703703704	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N
ecd7e7e2-639f-4a39-96c0-2471622466dd	0.3710344827586207	0.675	\N	7e2bddb2-6fc1-4d3e-8f50-95a6d241f012	\N	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, username, email, "passwordHash", type) FROM stdin;
5fdc2b44-a648-48ca-b4e4-2378a68dc1ec	admin	admin@solenia.dev	$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c	admin
ba42dc5a-db7b-42b9-9c4e-baa998a1865a	editor	editor@solenia.dev	$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c	editor
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
\.


--
-- Name: City City_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);


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
-- Name: Position Position_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_pkey" PRIMARY KEY (id);


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
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: City City_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


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
-- Name: Position Position_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_personOfInterestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_personOfInterestId_fkey" FOREIGN KEY ("personOfInterestId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

