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
-- Name: Breed; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public."Breed" OWNER TO postgres;

--
-- Name: Language; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public."Language" OWNER TO postgres;

--
-- Name: Membership; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Membership" AS ENUM (
    'POLITIC',
    'RELIGEUX',
    'MARCHAND',
    'CCCH',
    'CRIMINALITE',
    'OTHER'
);


ALTER TYPE public."Membership" OWNER TO postgres;

--
-- Name: OrganisationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrganisationType" AS ENUM (
    'CELLULE',
    'PRINCIPAL'
);


ALTER TYPE public."OrganisationType" OWNER TO postgres;

--
-- Name: Sex; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Sex" AS ENUM (
    'MAN',
    'WOMAN',
    'OTHER'
);


ALTER TYPE public."Sex" OWNER TO postgres;

--
-- Name: UserType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserType" AS ENUM (
    'admin',
    'editor',
    'viewer'
);


ALTER TYPE public."UserType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: City; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."City" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "kingdomId" text,
    "iconUrl" text,
    "isForDM" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."City" OWNER TO postgres;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: District; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."District" OWNER TO postgres;

--
-- Name: Kingdom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Kingdom" (
    id text NOT NULL,
    name text NOT NULL,
    population integer,
    description text,
    "dateInGame" timestamp(3) without time zone,
    color text,
    "isForDM" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Kingdom" OWNER TO postgres;

--
-- Name: Lore; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lore" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    tag text,
    "dateInGame" integer,
    summary text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isForDM" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Lore" OWNER TO postgres;

--
-- Name: LoreCity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LoreCity" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "cityId" text NOT NULL
);


ALTER TABLE public."LoreCity" OWNER TO postgres;

--
-- Name: LoreKingdom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LoreKingdom" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "kingdomId" text NOT NULL
);


ALTER TABLE public."LoreKingdom" OWNER TO postgres;

--
-- Name: LoreOrganisation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LoreOrganisation" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "organisationId" text NOT NULL
);


ALTER TABLE public."LoreOrganisation" OWNER TO postgres;

--
-- Name: LorePerson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LorePerson" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "personId" text NOT NULL
);


ALTER TABLE public."LorePerson" OWNER TO postgres;

--
-- Name: LorePlace; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LorePlace" (
    id text NOT NULL,
    "loreId" text NOT NULL,
    "placeId" text NOT NULL
);


ALTER TABLE public."LorePlace" OWNER TO postgres;

--
-- Name: Organisation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Organisation" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "parentOrganisationId" text,
    "organisationType" public."OrganisationType",
    "isForDM" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Organisation" OWNER TO postgres;

--
-- Name: OrganisationCity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrganisationCity" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "cityId" text NOT NULL
);


ALTER TABLE public."OrganisationCity" OWNER TO postgres;

--
-- Name: OrganisationKingdom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrganisationKingdom" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "kingdomId" text NOT NULL
);


ALTER TABLE public."OrganisationKingdom" OWNER TO postgres;

--
-- Name: OrganisationMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrganisationMember" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "personId" text NOT NULL
);


ALTER TABLE public."OrganisationMember" OWNER TO postgres;

--
-- Name: OrganisationPlace; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrganisationPlace" (
    id text NOT NULL,
    "organisationId" text NOT NULL,
    "placeId" text NOT NULL
);


ALTER TABLE public."OrganisationPlace" OWNER TO postgres;

--
-- Name: PersonOfInterest; Type: TABLE; Schema: public; Owner: postgres
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
    "isForDM" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."PersonOfInterest" OWNER TO postgres;

--
-- Name: Place; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Place" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "kingdomId" text,
    "cityId" text,
    "iconUrl" text,
    "districtId" text,
    "isForDM" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Place" OWNER TO postgres;

--
-- Name: Position; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."Position" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    type public."UserType" NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: City; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."City" (id, name, description, "kingdomId", "iconUrl", "isForDM") FROM stdin;
f4722f65-bb3e-400d-b818-260db1011f3a	Bag	Bag	\N	/Icon/village.png	f
c136e1cc-0f84-4729-b3e2-8dee3e6d46e1	Olcario	Olcario	\N	/Icon/fortified-city.png	f
b6d0fb34-df10-41f9-ab7a-585402919c03	Damor	Damor	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f
da0f5b30-743d-422a-b281-9d276681f56f	Vonbadur	Vonbadur	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f
ec01895d-64a4-4687-8f2d-035f149904ed	Dugh Maral	Dugh Maral	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/capital.png	f
19df6e53-8868-4511-8a58-39c9e3659c21	Khairn Ladim	Kairn Ladim	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f
bdb2dcea-441e-4a99-9f75-200d554d88f6	Khairn Baduhr	Khairn Baduhr	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f
4de27113-8487-455c-ab37-d740d69d5619	Nollodrin	Nollodrin	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f
2859a2c9-8ccc-4de5-a74e-4b8be15bb838	Orfani	Orfani	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/village.png	f
19e896ae-0b41-46ed-923f-825f43215b53	Doxato	Doxato	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	/Icon/fortified-city.png	f
7f0198e3-b293-4d8c-a7ed-0bd1b9120e17	Port des Abymes	Port des Abymes	\N	/Icon/fortified-city.png	f
0ff4ed2b-4048-4ce9-9ec3-1c617727895c	Bakata	Bakata	\N	/Icon/fortified-city.png	f
bb93ab0c-8f81-430e-ac0b-16800b113e0e	Raine	Raine	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f
899e1c2a-a99b-4eef-8e00-5657476b4a27	Amblon	Amblon	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/village.png	f
7ccf7b24-0e5e-42e5-8493-76ee231c25ac	Gandor	Gandor	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/capital.png	f
295580b8-9df6-4209-9d2a-1d237144a69c	Sillenor	Sillenor	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/village.png	f
96745fc0-6d7e-421c-a0a8-3bbb12b8f4c9	Jima	Jima	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/village.png	f
3cd0ba8b-db9c-4cbe-83e9-49a515399cbb	Phara	Phara	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/city.png	f
157a72f3-cc46-4430-8e4f-9ab0fefcf133	Vesa	Vesa	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f
57171985-dade-4fcc-a00b-c06de058c7d6	Huriya	Huriya	\N	/Icon/city.png	f
b508926d-83a0-4372-92d7-2363aeade1f4	Flosse	Flosse	44383b5f-5ed4-4ae8-91ac-2c377928206e	/Icon/fortified-city.png	f
16e1a8a5-bbef-4927-b769-733a5cc63521	Brodnica	Brodnica	4d37eed1-161e-4156-970c-381793c3d614	/Icon/capital.png	f
e46962cc-2d61-423b-b3b8-e7466ffcd976	Morag	Morag	4d37eed1-161e-4156-970c-381793c3d614	/Icon/village.png	f
ce4ce8b9-77fd-4105-a0fb-ee5edb557a7c	Orneta	Orneta	4d37eed1-161e-4156-970c-381793c3d614	/Icon/village.png	f
443543db-314f-472e-a899-3d42f34fdb5f	Karni	Karni	4d37eed1-161e-4156-970c-381793c3d614	/Icon/fortified-city.png	f
e270ac1d-4df4-4af9-bb2c-ed96865d3b12	Velmira	capital elfe	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/capital.png	f
d5c6a0ac-1cb8-47cb-b0fc-aa17fefc587e	Asyn	Asyn	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f
9c44080d-9577-4c58-9a2f-4b8111c491d2	Oserinne	Oserinne	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f
94a2fd1d-9a42-4b60-ba6e-865208b430c1	Kelrion	Kelrion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/fortified-city.png	f
181d1980-2ade-4c0d-bf44-4252e636dc6c	Irnael	Irnael	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f
5d0cc51f-c6ac-4036-ad03-7344efecb965	Erilion	Erilion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/village.png	f
2580fe9d-e8a1-46f1-83c1-d33b26ed6863	A'salion	A'salion	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	/Icon/capital.png	f
3777dab0-1e36-491c-859a-fdc48062201b	Örvat	Örvat	\N	/Icon/fortified-city.png	f
752d5094-7102-4a38-926a-cb814de89e27	Åsel	Åsel	\N	/Icon/village.png	f
6c33f828-7b6b-4890-95ce-0822caa1e807	Phosi	Phosi	\N	/Icon/village.png	f
ce3fb962-bb73-47f4-8e12-656c0af3f4a1	Mongar	Mongar	\N	/Icon/fortified-city.png	f
a602cacc-0d51-4334-a9e9-b54a7d60ac24	Anol	Anol	\N	/Icon/fortified-city.png	f
47119f73-bd40-4a59-b1c4-b8daf1b0eade	Haneti	Haneti	\N	/Icon/fortified-city.png	f
6b642f1f-70b8-4b37-ba14-9e3922efe3a8	Kashari	Kashari	\N	/Icon/fortified-city.png	f
6d39b2bc-6488-4763-9643-b57e9af59c03	Alagir	Alagir	\N	/Icon/city.png	f
f410d0e6-ae0b-47b9-92d0-a91e1a0e65a0	Mahate	Mahate	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f
c1e27b23-4188-4fdd-96df-9d9dba88833b	Madja	Madja	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f
1ab001f3-e7d0-4cb2-a0ff-c6800549dc8d	Aya-Toumin	Aya-Toumin	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f
ac1ff1a0-087e-4400-8ce6-91337e238d24	Sulayman	Sulayman	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/city.png	f
b35688a0-96ed-4416-82b9-19db566f7815	Sandarane	Sandarane	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/capital.png	f
aef53759-d6b9-4bca-bc2b-7aca5ffb2676	Gizab	Gizab	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f
3c5962f4-339b-433a-b253-135a32db63f1	Nyala	Nyala	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f
d11ea82c-fc71-44f1-8d14-5ae423a31f83	Alkwariz-mi	Alkwariz-mi	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f
cfda6692-0df6-400e-b9df-6786da0f1d92	Shur-Abak	Shur-Abak	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f
42220881-20fd-4bc5-a818-d00cd79473b7	Al-Kurfrah	Al-Kurfrah	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f
b220665e-2800-44ce-84e0-b0f9313640ed	Zametan	Zametan	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/village.png	f
7c205d43-f91b-46f1-8809-7e774090823f	Raoued	Raoued	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	/Icon/fortified-city.png	f
f9f210bd-a735-4acc-a72e-701aea69750b	Iserna	Iserna	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f
bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	Russolio	Russolio	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f
fd428152-24ae-4cf5-8239-ad928df9f930	Raino	Raino	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/village.png	f
72589e8c-bbbe-43fe-bb68-c7be7fbe0347	Stiffe	Stiffe	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/village.png	f
8d5a0617-0e82-4a8a-855f-582c1003805f	Calteri	Calteri	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/capital.png	f
42044469-437c-43d5-b1e3-41c4c6b18035	Arrezo	Arrezo	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f
d52e5905-28b3-427a-b3ed-82a0d5646a9c	Volturo	Volturo	cbf00301-c56a-4702-92b7-c5fa6013f99a	/Icon/fortified-city.png	f
d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	Momoritania	Momoritania	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/capital.png	f
388f3dfc-a23b-4cb4-8a38-4f15e36cdca6	Gomati	Gomati	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f
2c8c2982-7dfa-4be4-96e9-328c05473197	Vara	Vara	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f
d182b816-ac9f-4f81-afb7-44c7bff6178f	Kalanos	Kalanos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f
e2d54173-58fe-4417-b763-e90fca60fd31	Xanthi	Xanthi	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f
fce0576a-07d3-436d-a1be-2f7ea9ad34f2	Almiros	Almiros	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/city.png	f
4f2eca99-0e4a-4039-a211-9509758b8de3	Naxos	Naxos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f
3c456778-4811-4c35-8504-6af9803f8c5e	Dioni	Dioni	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/village.png	f
7e2bddb2-6fc1-4d3e-8f50-95a6d241f012	Kelos	Kelos	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f
264a9f82-fdc3-4667-bd60-439a2a89ab04	Thiva	Thiva	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	/Icon/fortified-city.png	f
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, description, "dateInGame", "kingdomId", "cityId", "placeId", "personOfInterestId", "authorId", "districtId") FROM stdin;
\.


--
-- Data for Name: District; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."District" (id, name, motto, content, ambiance, rumors, secret, "cityId") FROM stdin;
\.


--
-- Data for Name: Kingdom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kingdom" (id, name, population, description, "dateInGame", color, "isForDM") FROM stdin;
e44df0a6-ffda-4e97-8f8b-bd34440f07b4	Le Royaume d'Alberan	300000	Le Royaume d'Alberan est coupé en 2 par une guerre civile au nord les elfes des neiges qui veulent étendre les glaces et au Sud les elfes qui reboisent la région.	0293-09-11 23:50:39	#21a207	f
929e6be3-224f-4d25-8ea4-8a9d19aa8a02	La Reinaume de la mère de pierre	150000	La Reinaume de la mère de pierre	0191-06-02 23:50:39	#e99d1c	f
44383b5f-5ed4-4ae8-91ac-2c377928206e	Le Royaume de Gandorènne	350000	Monarchie dirigé d'une main de fer par David IV. (avec ça nouvelle épouse Geani) Elle fut créer il y a 100 ans (par David III), \n\nLa société se base sur un système de castes avec dans l'ordre la noblesse/érudit-mage > Les soldats et le clergé > les gens communs > les humains. \n\nActuellement en guerre froide avec le saint empire Momoritanien. Les 2 forces avance de plus en plus vers un conflit ouvert.\n\nla capital est Gandor et la richesse de l'empire ce fait grâce à l'abondance de denrée alimentaire. Au nord de Gandor beaucoup de plaine sont aménagés en exploitation agricole.\n\nLa population est assez éclectique(sauf Humain) :\n35% Tiffelin\n55% Autres \n10% Humain	\N	#124587	f
4d37eed1-161e-4156-970c-381793c3d614	Dominion de L'Antre	75000	Histoire :\nNation majoritairement drakonien elle fut vassalisée par les duchés Dolomite après que les grands dragons chromatiques se soient retirés des affaires des mortels. \nLe Grand blocus maritime de l’an 1006 à fait céder l’Antre.\nEconomie :\nComment le système économique fonctionne ?\n\tExport de minerai avec les duché, les cités libres et Gandorennes.\nQuelles sont les ressources les plus précieuses ?\n\tLe Fer-dragon\nComment les ressources sont vendues ?\n\tLe Fer-dragon, le cuivre, le fer, quelques peau d'animaux\nQuelles sont les régions les plus riches ?\n\tL’Est/Sud-Est\nReligion :\n\ndieux/déesses des religions du monde ?\nTiamat le dieu dragon\nMyths and Legends ?\n\tUn jour drakonien réveillera Tiamat de sa torpeur et unira les dragon\nPrincipaux idéal ou principes ?\n\tL’orgueil \nPossible tentions entre les religions ? guerre ?\n\tTension entre les religions et le culte de Tiamat\nMagie :\nQuasiment que des ensorceleurs avec une “école” pour les former.\nExecutive :\nSystème des gouvernements ? \nUne royauté.\nQui à le pouvoir ? et comment il s’échange ?\nLe Roi Tonur 17eme du nom. Le pouvoir se transmet de père en fils et il prend le nom de Tonur.\nComment les lois sont gérées ?\nPar décret royal. \nQui gère l'application de la loi ? \nLe maire des villes, les chevaliers et miliciens.\nTopologie : \nZone géographique remarquable ?\n\tChaîne de montagne (les crocs du dragon)\nComment les ressources naturelles sont-elles disponibles ?\n\tLa Chasse, le minage et raffinement (pour le Fer-Dragon)\nComment la géolocalisation influe-t-elle sur la survie des cultures ? \n\tInsulaire donc ils vivent donc quasiment en auto suffisance.\nInhabitant :\nCombien de races intelligentes vivent dans le monde ? Comment interagissent- elles entre elles ?\nToutes mais peu de Gnome car mal vu après la vassalisation.\nCulture :\nQuelle est la fonctionnalité ou différence entre les cultures ?\n\tUn peuple très uni assez méfiant des étrangers.\nChef d'œuvre dans l’arts / littérature / architecture  ?\n\tLe sanctuaire au dragon taillé à même dans la montagne \nQuel conflit il y a dans votre société ?  de gros conflits  ? récurrent ?\n\tPas mal de tension entre Drakonien/Gnome \nQuels effets ces conflits ont sur le monde ?\n\tBeaucoups de rixe/raquette ciblé en les 2 races \nSociété :\nQuelles sont les races les plus importantes  ?\nLes Drakonien/Gnome.\nQui sont les moins ?\nLes autres.\nComment elle coexiste ensemble ?\nMal tension entre Drakonien/Gnome	0104-05-23 23:50:39	#e9631c	f
6d9412ba-0f6d-41d5-b7b4-13e6549a990d	Le Sultanat de Sandarane	225000	Ce pays situé dans le sud-est de Solenia serait d'après les légendes le premier royaume à avoir été fondé. C'est un pays monarchique gouverné par la famille Alym depuis plus de 400 ans. La population y est majoritairement humaine bien que de moins en moins dû à son ouverture sur le monde. Bien qu'on ne se l'explique pas, les personnes qui en sont originaires ou vécus assez longtemps ont pour spécificité de donner toujours naissance à des jumeaux. Certaines hypothèses avancent qu'il s'agirait d'un élément dans l'air qui modifierait les personnes. D'autres qu'une malédiction ou bénédiction (suivant les point de vue) des dieux à était lancé sur le premier royaume de Solénia à relever de "la longue nuit".\n\nCa géographie quand à elle la coupe en 4 régions : \n\nLa première que l'ont appel "Alfaragh Al'abyad" ou le Vide Blanc, démarre depuis isthme Aljisr qui relie le continent au royaume et s'étend jusqu'au grand fleuve Alhayaa que l'on peu traduire en "La Vie". Elle contint des dunes blanches à perte de vue que seul une poignée de hameau ou de ville vienne interrompre. On y retrouve Mahat la cité forteresse ou transite l'entièreté des caravane marchande entrant dans le pays. Aya-Toumin petite ville nichée au cœur des dunes connue sont monastère dédié à Searinne Dieu de la Lumière et des Ombres et enfin Sulayman dite "la magnifique" deuxième plus grande cité du royaume point central dans l'échange de marchandise.\n\nLa seconde région appelée "Alqalb Akhdar" ou "le Cœur Vert" représente tout le nord du pays. Elle est caractérisée par des plaines verdoyantes et des jungle luxuriante. C'est là que se trouve Sandarane la capitale éponyme appelée aussi la cité au mille cascades de part son système d'irrigation si particulier. C'est là que se trouve le siège du pouvoir ou Moite le juste règne actuellement. Plus au sud se trouve Nyala ville exclusivement orienté vers l'agriculture, elle produit est stockée la majeure partie de la nourriture du pays. Encore au sud se trouve Gizab. Cette petite cité est connue pour sa lutte contre l'avancée du désert en plantant des milliers d'arbres.\n\nLa troisième région est appelé "Al'arkhabil alsama" ou l'archipel du ciel. Elle regroupe toutes les îles au nord. On y trouve des îles entièrement recouvertes de jungle ou des îles parcourues par d'immense chaîne montagne. Trois villes y sont particulièrement connues. Madja connue pour sa scierie et sont travaille du bois. Zametan est quant à elle une petite ville portuaire spécialisée dans la culture de perle et la confection de bijoux et tout au nord (hors maps) Raoued est une ville fortifiée connue pour ses chantier naval à la pointe de la technologie et de la magie.\n\nEnfin la dernière région est le sud-est du royaume appelé "Almawt Al'ahmar" ou la mort rouge à cause de la couleur ocre de ces gigantesques dunes et collines. Les conditions de vie y sont aussi extrêmes avec des écarts de température entre le jour et la nuit de plus 50 degrés et ce sans compter la flore et faune sauvage meurtrière. Seuls quelques groupes de nomades et quelques villes troglodytes y vivent. Il y a Alkwariz-mi ville portuaire a l'entrée du désert rouge, point d'entrée du commerce venue des autres continents. Shur-abak et Al-Kurfrah quant à elle son 2 citées fortement militarisé créé pour contrôler soit l'entrée du canal "Al Gharsa" soit l'extrême sud avec ça faille pas entièrement exploré que l'on appel "Al-Layl" la nuit.\n\nSultan / Sultane (roi / reine)\nSultane validé Titre honorifique porté par la mère du sultan.\nYabgu (prince)\nBeylerbey (duc)\nPacha (marquis)\nBey (comte ou baron)\nAtabeg (régent)\n\nSultan : Alym\n	1958-03-05 23:00:00	#813412	f
cbf00301-c56a-4702-92b7-c5fa6013f99a	Duchés des Dolomite	150000	Histoire :\nNation majoritairement Gnome elle a vassalisée le royaume de l’Antre après que les grands dragons chromatiques se soient retirés des affaires des mortels.\nLe Grand blocus maritime de l’an 1006 à fait céder l’Antre.\nTrès connue pour leurs école de magie chaque ville c’est spécifié dans une école particulière.\nEconomie :\nComment le système économique fonctionne ?\nBeaucoup de manufacture mixant ingénierie/magie ils exportent aussi beaucoup de matière première magique avec les cité libre et le sultanat de Sandarane.\nQuelles sont les ressources les plus précieuses ?\nLe Fer-dragon runique, cuire de dragon runique (très rare et illégale braconnage de Sangdragon)\nComment les ressources sont vendues ?\nEn contrat exclusif avec la C.C.C.H pour la partie illégale un cartel gère une partie des marchés noir avec la C.C.C.H\nQuelles sont les régions les plus riches ?\n\tLe Nord avec son commerce avec les cités libres.\nReligion :\ndieux/déesses des religions du monde ?\nAzouth et Gond est assez prié\nMyths and Legends ?\n\t-\nPrincipaux idéal ou principes ?\n\tla connaissance et la créativité \nPossible tentions entre les religions ? guerre ?\n\tNone\n\nMagie :\nChaque ville à école de magie spécialisé dans une école\nCalteri : Évocation\nArrezo : Transmutation\nVolturo : Abjuration\nRussolio : Invocation\nStiffe : Divination\nRaino : Illusion\nIserna  : Enchantement\nExecutive :\nSystème des gouvernements ? \nUn conseil des mages : Magisterium\nQui à le pouvoir ? et comment il s’échange ?\nLe conseil des mages est créé par chaque ville qui envoie un et le conseille élit le Roi Archimage pour 20 prochaine années. \nComment les lois sont gérées ?\nPar vote unanime ou à la majorité. \nQui gère l'application de la loi ? \n\tmaître de l’école de magie (le représentant au conseil)\nLe maire des villes, les chevaliers et miliciens.\nTopologie : \nZone géographique remarquable ?\nLa forêt d’argent.\nLe Lac Vert (au sud de la capital)\nComment les ressources naturelles sont-elles disponibles ?\n\tDes essences de bois rare, beaucoups de culture de fruits et légumes\nComment la géolocalisation influe-t-elle sur la survie des cultures ? \n\tUne culture basé sur beaucoups de commerce avec les cités libres et un peu avec le sultanat\nInhabitant :\nCombien de races intelligentes vivent dans le monde ? Comment interagissent- elles entre elles ?\nToutes mais peu de Sangdragon car mal vu après la vassalisation.\nCulture :\nQuelle est la fonctionnalité ou différence entre les cultures ?\n\tUn peuple en général assez réservé \nChef d'œuvre dans l’arts / littérature / architecture  ?\n\tLe sanctuaire au dragon taillé à même dans la montagne \nQuel conflit il y a dans votre société ?  de gros conflits  ? récurrent ?\n\tPas mal de tension entre Drakonien/Gnome \nQuels effets ces conflits ont sur le monde ?\n\tBeaucoups de rixe/raquette ciblé en les 2 races \nSociété :\nQuelles sont les races les plus importantes  ?\nLes Gnome.\nQui sont les moins ?\nLes Drakonien.\nComment elle coexiste ensemble ?\nMal tension entre Drakonien/Gnome	0101-11-29 23:50:39	#631ce9	f
0bcb8247-1ea9-48b1-9619-15b5de56ad9c	Le Saint-Empire Momoritanien	420000	Famille royal Kinemor :\nRhendom/Taripica\nCalison/Norima \nLimor * Lauc\nTenabis/Alménia \nYmal\n\nAléthérite :\nLa socité momoritanien évolue autour de Aléthérite un materieau récolté depuis les bois de grand cerf blanc sacré.Il ont était fait en cadeau part le Alion (nature/artisanat) après un coups d’états manqué formenté par un groupe de mages. \n\nIl a comme spécificité de nullifier les pouvoirs de magie d’éther. (tout sauf la magie des clercs)\nAléthérite se retrouve dans les bâtiments dans les armes, armures et accessoires. Elle peut être utilisée comme composé dans des potions qui neutralisent les pouvoirs de concentration.\n\nil y a approximativement 100 troupeaux qui varie entre 50 et 1000 têtes	0671-09-11 23:50:39	#fddf21	f
\.


--
-- Data for Name: Lore; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lore" (id, title, content, tag, "dateInGame", summary, "createdAt", "updatedAt", "isForDM") FROM stdin;
\.


--
-- Data for Name: LoreCity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LoreCity" (id, "loreId", "cityId") FROM stdin;
\.


--
-- Data for Name: LoreKingdom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LoreKingdom" (id, "loreId", "kingdomId") FROM stdin;
\.


--
-- Data for Name: LoreOrganisation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LoreOrganisation" (id, "loreId", "organisationId") FROM stdin;
\.


--
-- Data for Name: LorePerson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LorePerson" (id, "loreId", "personId") FROM stdin;
\.


--
-- Data for Name: LorePlace; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LorePlace" (id, "loreId", "placeId") FROM stdin;
\.


--
-- Data for Name: Organisation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Organisation" (id, name, description, "parentOrganisationId", "organisationType", "isForDM") FROM stdin;
\.


--
-- Data for Name: OrganisationCity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrganisationCity" (id, "organisationId", "cityId") FROM stdin;
\.


--
-- Data for Name: OrganisationKingdom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrganisationKingdom" (id, "organisationId", "kingdomId") FROM stdin;
\.


--
-- Data for Name: OrganisationMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrganisationMember" (id, "organisationId", "personId") FROM stdin;
\.


--
-- Data for Name: OrganisationPlace; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrganisationPlace" (id, "organisationId", "placeId") FROM stdin;
\.


--
-- Data for Name: PersonOfInterest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PersonOfInterest" (id, name, description, "imageUrl", "STR", "DEX", "CON", "INT", "WIS", "CHA", "kingdomId", "cityId", "placeId", breed, sex, membership, languages, "districtId", "isForDM") FROM stdin;
\.


--
-- Data for Name: Place; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Place" (id, name, description, "kingdomId", "cityId", "iconUrl", "districtId", "isForDM") FROM stdin;
\.


--
-- Data for Name: Position; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Position" (id, x, y, "kingdomId", "cityId", "placeId", "personOfInterestId") FROM stdin;
c36a3ad8-aff6-4829-a4d2-7946d31b9a2b	0.448551724137931	0.8113425925925926	\N	ec01895d-64a4-4687-8f2d-035f149904ed	\N	\N
c6449d08-2650-43bb-95ad-19b2dd05eee8	0.3762758620689655	0.8083333333333333	e44df0a6-ffda-4e97-8f8b-bd34440f07b4	\N	\N	\N
163e0ea4-cec0-4e98-8faa-2317a99dbf8a	0.3988965517241379	0.7643518518518518	\N	5d0cc51f-c6ac-4036-ad03-7344efecb965	\N	\N
8e54ad1f-c9c7-4794-a374-83e67c11f44f	0.3828965517241379	0.9481481481481482	\N	e270ac1d-4df4-4af9-bb2c-ed96865d3b12	\N	\N
db0876f3-04c5-41fe-bbfe-2fcbf3871b15	0.3122758620689655	0.4416666666666667	\N	157a72f3-cc46-4430-8e4f-9ab0fefcf133	\N	\N
9908eaae-78b7-4f02-aa06-1b03c3efb2ea	0.3277241379310345	0.9027777777777778	\N	d5c6a0ac-1cb8-47cb-b0fc-aa17fefc587e	\N	\N
afd00cc6-3a2f-4633-8219-4449dba1d986	0.4231724137931034	0.7944444444444444	\N	bdb2dcea-441e-4a99-9f75-200d554d88f6	\N	\N
30f509a9-5b53-4e28-a998-90acacf976fe	0.4402758620689655	0.9268518518518518	\N	9c44080d-9577-4c58-9a2f-4b8111c491d2	\N	\N
c5430d76-e94e-41d1-bcc2-4b9a5a828dcc	0.4137931034482759	0.8675925925925926	\N	94a2fd1d-9a42-4b60-ba6e-865208b430c1	\N	\N
196df31f-c103-4e46-96b2-dd680510e9f8	0.3332413793103448	0.825925925925926	\N	181d1980-2ade-4c0d-bf44-4252e636dc6c	\N	\N
68cedd30-235d-490d-bc0a-fdb463d22224	0.3122758620689655	0.5305555555555556	\N	57171985-dade-4fcc-a00b-c06de058c7d6	\N	\N
4f63ae08-7f22-4074-8c5c-dbeab6813b59	0.5075862068965518	0.7638888888888888	\N	4de27113-8487-455c-ab37-d740d69d5619	\N	\N
84019ca9-e1c9-4668-8b37-3ac05edcdce9	0.3668965517241379	0.725925925925926	\N	2580fe9d-e8a1-46f1-83c1-d33b26ed6863	\N	\N
6666bb19-4443-492b-8f9f-2db1d718f097	0.6653793103448276	0.4074074074074074	\N	c1e27b23-4188-4fdd-96df-9d9dba88833b	\N	\N
3c3dbf96-d1f9-42b8-97dd-d7465b30fc93	0.4797241379310345	0.7418981481481481	\N	2859a2c9-8ccc-4de5-a74e-4b8be15bb838	\N	\N
232267da-6927-4b9b-bf4d-eefda5d00d96	0.2168275862068965	0.8768518518518519	\N	3777dab0-1e36-491c-859a-fdc48062201b	\N	\N
3a15007b-6fb4-4100-b1d7-ff5c9dda4a4f	0.3310344827586207	0.6231481481481481	\N	b508926d-83a0-4372-92d7-2363aeade1f4	\N	\N
ae802ffe-9b9b-49f5-b5e4-d2ed21613011	0.2784827586206897	0.8619212962962963	\N	752d5094-7102-4a38-926a-cb814de89e27	\N	\N
f7e6214f-1c1b-4085-be20-a88cf9fabd9a	0.2424827586206897	0.7344907407407407	\N	6c33f828-7b6b-4890-95ce-0822caa1e807	\N	\N
a00caefd-8e1b-4a67-bf1c-da75f353ddad	0.4281379310344828	0.7196759259259259	\N	19e896ae-0b41-46ed-923f-825f43215b53	\N	\N
08f06166-475b-4985-95fd-29fde1415d07	0.1462068965517241	0.7087962962962963	\N	f4722f65-bb3e-400d-b818-260db1011f3a	\N	\N
7610e332-0ecf-498e-9e14-a58ae1a19030	0.32	0.7340277777777777	\N	c136e1cc-0f84-4729-b3e2-8dee3e6d46e1	\N	\N
7c10e3e6-aa41-478a-a8d1-88e4f9f8aebd	0.8706206896551724	0.680324074074074	\N	7f0198e3-b293-4d8c-a7ed-0bd1b9120e17	\N	\N
65c5edc4-e816-4626-940c-0c8f29c730ee	0.5197241379310344	0.8407407407407408	929e6be3-224f-4d25-8ea4-8a9d19aa8a02	\N	\N	\N
81310f03-4cc4-4a45-bd17-1ad196165f1c	0.4667586206896552	0.8930555555555556	\N	b6d0fb34-df10-41f9-ab7a-585402919c03	\N	\N
5a8bbd53-acac-4ee1-8361-f6d512df76fa	0.4579310344827586	0.8666666666666667	\N	da0f5b30-743d-422a-b281-9d276681f56f	\N	\N
d2b06a26-e9cf-499e-9a4b-b68906424917	0.8550344827586207	0.6303240740740741	\N	0ff4ed2b-4048-4ce9-9ec3-1c617727895c	\N	\N
36c6fd69-5226-46f2-af6b-c26c44944419	0.4772413793103448	0.8240740740740741	\N	19df6e53-8868-4511-8a58-39c9e3659c21	\N	\N
2f172cb1-ddcb-441d-8e0a-e37d509cb404	0.224551724137931	0.2861111111111111	\N	16e1a8a5-bbef-4927-b769-733a5cc63521	\N	\N
2677259d-1928-48a5-b127-dfdc1a3b971a	0.2019310344827586	0.5527777777777778	44383b5f-5ed4-4ae8-91ac-2c377928206e	\N	\N	\N
49b00d1a-5338-4e83-89d1-fb3046fac8f4	0.3542068965517242	0.675	\N	bb93ab0c-8f81-430e-ac0b-16800b113e0e	\N	\N
04b850ec-be4f-44fe-89cd-f93d53db4084	0.1677241379310345	0.3546296296296296	\N	e46962cc-2d61-423b-b3b8-e7466ffcd976	\N	\N
1f16356e-abff-43c8-a441-00dad051ba4b	0.2813793103448276	0.637962962962963	\N	899e1c2a-a99b-4eef-8e00-5657476b4a27	\N	\N
745c25d4-d3e7-4027-b91e-5cc53bfa86fe	0.2173793103448276	0.6296296296296297	\N	7ccf7b24-0e5e-42e5-8493-76ee231c25ac	\N	\N
db84f3bc-5262-4741-9b74-b82b797d9e7e	0.2604137931034483	0.562037037037037	\N	295580b8-9df6-4209-9d2a-1d237144a69c	\N	\N
9ae59802-16d8-4ed6-a03e-02b754b1871a	0.1688275862068966	0.5101851851851852	\N	96745fc0-6d7e-421c-a0a8-3bbb12b8f4c9	\N	\N
fd3d1db5-52bd-4220-9cde-0901c265b358	0.2162758620689655	0.4296296296296296	\N	3cd0ba8b-db9c-4cbe-83e9-49a515399cbb	\N	\N
933cfc0f-f396-409e-b1e6-89573e876e17	0.512551724137931	0.4611111111111111	\N	47119f73-bd40-4a59-b1c4-b8daf1b0eade	\N	\N
0747fc64-5be5-44ad-b6b0-9c5239ed20ae	0.1699310344827586	0.2601851851851852	\N	ce4ce8b9-77fd-4105-a0fb-ee5edb557a7c	\N	\N
2c7b051a-69c3-44b2-afd2-9ac38b0b1481	0.2140689655172414	0.2009259259259259	\N	443543db-314f-472e-a899-3d42f34fdb5f	\N	\N
7c1b2560-5421-482b-9031-ff7349abea26	0.1456551724137931	0.2953703703703704	4d37eed1-161e-4156-970c-381793c3d614	\N	\N	\N
2565403b-fad8-46de-80bd-61ae88007cfe	0.745448275862069	0.203125	\N	cfda6692-0df6-400e-b9df-6786da0f1d92	\N	\N
da1c12f8-2106-4ad5-b4b3-b241fb2ac0ce	0.4764137931034483	0.3863425925925926	\N	a602cacc-0d51-4334-a9e9-b54a7d60ac24	\N	\N
1c156fd8-2ac4-478d-b0b5-f9e206d65f9e	0.577103448275862	0.362037037037037	\N	6b642f1f-70b8-4b37-ba14-9e3922efe3a8	\N	\N
1f0bf2eb-9ccd-4454-9201-5f5e70018aa1	0.4055172413793103	0.3414351851851852	\N	ce3fb962-bb73-47f4-8e12-656c0af3f4a1	\N	\N
20bb159b-238d-453e-a80b-81373422e978	0.7062068965517241	0.2805555555555556	6d9412ba-0f6d-41d5-b7b4-13e6549a990d	\N	\N	\N
9adfeea4-355b-4fc5-807d-a781d529e90b	0.2987586206896552	0.3815972222222222	\N	6d39b2bc-6488-4763-9643-b57e9af59c03	\N	\N
d19da760-a091-454b-ab57-d98f772f806a	0.7336551724137931	0.365625	\N	aef53759-d6b9-4bca-bc2b-7aca5ffb2676	\N	\N
167e3d3c-8c79-4dd3-a6cd-a8a1ae45cb40	0.7624827586206897	0.3148148148148148	\N	ac1ff1a0-087e-4400-8ce6-91337e238d24	\N	\N
09a2d22e-2567-4886-8af8-82b2b85f3908	0.7955862068965517	0.4416666666666667	\N	b35688a0-96ed-4416-82b9-19db566f7815	\N	\N
e0a9a3ec-02df-4d41-9ddd-3a11b549d1f5	0.8339310344827586	0.3034722222222222	\N	d11ea82c-fc71-44f1-8d14-5ae423a31f83	\N	\N
2fdf935e-0db6-406c-b51b-7d9ab0f9a7b7	0.6819310344827586	0.3199074074074074	\N	1ab001f3-e7d0-4cb2-a0ff-c6800549dc8d	\N	\N
1f1e6a0c-60e3-4d5d-9491-e144bb674b0a	0.7882758620689655	0.3931712962962963	\N	3c5962f4-339b-433a-b253-135a32db63f1	\N	\N
0682bb70-25ce-46be-9628-b093358903e4	0.634896551724138	0.349537037037037	\N	f410d0e6-ae0b-47b9-92d0-a91e1a0e65a0	\N	\N
327c97e1-e0a5-44b5-8049-2ebccc71181c	0.6510344827586206	0.2490740740740741	\N	42220881-20fd-4bc5-a818-d00cd79473b7	\N	\N
ae75863c-031d-4978-b363-ab3869290463	0.7183103448275862	0.4554398148148148	\N	b220665e-2800-44ce-84e0-b0f9313640ed	\N	\N
053d7be3-8040-400b-afe8-feffd93293ad	0.7536551724137931	0.53125	\N	7c205d43-f91b-46f1-8809-7e774090823f	\N	\N
7c27c736-7e96-445d-b488-ce7e33ede435	0.4077241379310345	0.2111111111111111	cbf00301-c56a-4702-92b7-c5fa6013f99a	\N	\N	\N
b65abcae-c919-45e7-bcd2-b0a340be9bd6	0.4590344827586207	0.1421296296296296	\N	f9f210bd-a735-4acc-a72e-701aea69750b	\N	\N
63388216-6448-4f36-8572-9470e2258c11	0.353103448275862	0.1902777777777778	\N	bd4c09dd-8a69-4cc1-a961-510fe4a8d3c3	\N	\N
dad65cb7-8c3a-4fb3-8983-0da6b76aad82	0.510896551724138	0.1976851851851852	\N	fd428152-24ae-4cf5-8239-ad928df9f930	\N	\N
78820537-38ca-4571-ae7f-16471c63b042	0.3966896551724138	0.2523148148148148	\N	72589e8c-bbbe-43fe-bb68-c7be7fbe0347	\N	\N
6d98cdb4-81cb-47c9-8cb8-a2d2476c79fb	0.3884137931034483	0.2930555555555556	\N	8d5a0617-0e82-4a8a-855f-582c1003805f	\N	\N
e107a1bc-ff67-47d8-b35a-8335e9808553	0.3282758620689655	0.2958333333333333	\N	42044469-437c-43d5-b1e3-41c4c6b18035	\N	\N
935e1465-d979-4c82-bad5-ef373fa02be5	0.5142068965517241	0.3024305555555555	\N	d52e5905-28b3-427a-b3ed-82a0d5646a9c	\N	\N
ebdbcdf5-faf3-4f9c-830b-dc7ee325acd2	0.5416551724137931	0.5405092592592593	\N	d1c6fa1b-b3bb-48bc-a98a-58f26c48c602	\N	\N
98b30bf2-387a-4b58-910b-a83a3fc4b8fb	0.4766896551724138	0.6930555555555555	\N	388f3dfc-a23b-4cb4-8a38-4f15e36cdca6	\N	\N
5ef71402-6ec7-4685-9e62-3e5e72bd3df4	0.3376551724137931	0.5935185185185186	\N	2c8c2982-7dfa-4be4-96e9-328c05473197	\N	\N
c1f3d85b-2edd-4246-9bb2-9c37adf620e1	0.336	0.4259259259259259	\N	d182b816-ac9f-4f81-afb7-44c7bff6178f	\N	\N
bcef500b-19f3-43df-b027-1f2b8a397b28	0.4220689655172414	0.4527777777777778	\N	e2d54173-58fe-4417-b763-e90fca60fd31	\N	\N
60fcc154-6a23-452c-8418-3c3e396eb930	0.4918620689655173	0.6366898148148148	\N	4f2eca99-0e4a-4039-a211-9509758b8de3	\N	\N
a4deecef-b374-4711-9311-17f5da21a19b	0.4153103448275862	0.6118055555555556	\N	3c456778-4811-4c35-8504-6af9803f8c5e	\N	\N
ecd7e7e2-639f-4a39-96c0-2471622466dd	0.3746206896551724	0.674074074074074	\N	7e2bddb2-6fc1-4d3e-8f50-95a6d241f012	\N	\N
253353ba-334d-4abf-b2cd-098e20a2bb66	0.512	0.4976851851851852	\N	264a9f82-fdc3-4667-bd60-439a2a89ab04	\N	\N
e4e74407-cd96-4d61-bbd0-826a33b71204	0.4645517241379311	0.5509259259259259	\N	fce0576a-07d3-436d-a1be-2f7ea9ad34f2	\N	\N
d2d32195-df3c-4d1a-a722-8e625a3eba48	0.5164137931034483	0.5916666666666667	0bcb8247-1ea9-48b1-9619-15b5de56ad9c	\N	\N	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, email, "passwordHash", type) FROM stdin;
5fdc2b44-a648-48ca-b4e4-2378a68dc1ec	admin	admin@solenia.dev	$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c	admin
ba42dc5a-db7b-42b9-9c4e-baa998a1865a	editor	editor@solenia.dev	$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c	editor
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3f816ef0-9ffb-4fb5-8a13-76bb4256a0eb	d7d3a33fcc95f353fcc4211830de2ec46944fbb23dcf9e23cd5244e93ef9dbee	2025-12-21 16:04:52.166487+01	20251221150452_init	\N	\N	2025-12-21 16:04:52.151305+01	1
979dfbfc-1cbb-49c4-9031-a0fd1de12d0e	03aacbaeb1381b398955cc90b449c121bc9345644d0980a21ab74b4cedd9a244	2026-03-15 09:40:36.219437+01	20260313000000_add_is_for_dm	\N	\N	2026-03-15 09:40:36.204496+01	1
740549c5-3cd9-4bd0-8b80-b951bc99d761	0339f06624c9c7daf882a0cf68ae35ac804cc5917077b9ca2f25c8d9559e4abe	2025-12-24 11:19:35.310095+01	20250121120000_add_city_icon_url	\N	\N	2025-12-24 11:19:35.302434+01	1
e2706a9f-349b-4597-b591-3854eaa8220a	258ac73f273e2e05bdb9593789622c4af4c3cb2a0de899957ba359efbac79d8e	2025-12-24 14:15:12.724877+01	20250121130000_add_place_icon_url	\N	\N	2025-12-24 14:15:12.717745+01	1
12ba0fb1-c630-4d01-8cce-9e31dd99abe5	c9230b51519fab9313a182e07a3bbdf66e3b9784867bbe7dce231d552711ae5c	2025-12-28 12:50:43.993239+01	20250121140000_add_person_enums	\N	\N	2025-12-28 12:50:43.972406+01	1
52bedebf-15c1-45f3-a066-84fdc206183a	4ac2e1ad15526a991dddfd710b0c1875a878f1740c7adc592db50f908df7f6c5	2026-01-15 21:43:23.099573+01	20250125000000_add_district_entity	\N	\N	2026-01-15 21:43:23.049392+01	1
68813713-090c-4ffc-9221-77e472bc638f	54862024e5eaa861ef3a21450833b0f372bafbd33ac2aa089414c53a6996e60e	2026-01-20 18:04:53.84632+01	20250126000000_update_district_fields	\N	\N	2026-01-20 18:04:53.826308+01	1
8cf346f2-89e6-4d3a-9e0f-bab1a6105c5c	7f9ed95ea414f1028d6c31e37a22ad64cc04599202c92708984f976c6420ab74	2026-01-20 18:09:07.742208+01	20250126010000_remove_district_position	\N	\N	2026-01-20 18:09:07.732526+01	1
8e19ed44-5ebd-484b-93d9-5ed53fd843c8	dffe5037fdeefaa67129d1b33bb7fe86ff80a77b1e2ce7e3554f689e5f9ea4ab	2026-01-22 17:26:52.165423+01	20250127000000_add_organisation_entity	\N	\N	2026-01-22 17:26:52.127677+01	1
6f04ca09-956d-454f-921f-0e0ec83b0172	d7214e217606d9b9015957cebf2fa1b3c862cbc97203d3ce37ef7a4d017889b3	2026-01-28 17:16:37.913589+01	20250128000000_add_organisation_hierarchy	\N	\N	2026-01-28 17:16:37.889824+01	1
be58ffcb-34c3-42d2-b595-a312a6217c7c	e1799b3e14df28dcb74ed1a00c1d9317a20519bca1cfb41d0fdb7344ec72404f	2026-01-28 17:16:37.97033+01	20250128000001_add_organisation_kingdom	\N	\N	2026-01-28 17:16:37.914057+01	1
ac697da8-7750-4b10-ac42-4f8fca61577c	5bcef85b72400afb5c4bf5201e11dc3f9e6fb826098a84b6d1bd7c300b486583	2026-01-29 10:25:22.451412+01	20250128000002_add_organisation_type	\N	\N	2026-01-29 10:25:22.427917+01	1
ad8927e2-4f5f-4e4a-b776-6e0208dc2902	0da2c10c0cb5e7c0b47569313bb8635dda7aa6c3d0ff5c9453b5590a19ea0745	2026-02-23 22:24:55.566873+01	20250223000000_add_kingdom_color	\N	\N	2026-02-23 22:24:55.551827+01	1
5464b5f3-c6fa-47c4-9bdc-a20e5bac7847	0853f88ac5b0d8061c0c6fdaaa910b53e5f7f59cc39ef1b99d681adc3f92f657	2026-03-12 14:29:10.613419+01	20260312000000_add_lore_entity	\N	\N	2026-03-12 14:29:10.563659+01	1
\.


--
-- Name: City City_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: District District_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."District"
    ADD CONSTRAINT "District_pkey" PRIMARY KEY (id);


--
-- Name: Kingdom Kingdom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kingdom"
    ADD CONSTRAINT "Kingdom_pkey" PRIMARY KEY (id);


--
-- Name: LoreCity LoreCity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreCity"
    ADD CONSTRAINT "LoreCity_pkey" PRIMARY KEY (id);


--
-- Name: LoreKingdom LoreKingdom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreKingdom"
    ADD CONSTRAINT "LoreKingdom_pkey" PRIMARY KEY (id);


--
-- Name: LoreOrganisation LoreOrganisation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreOrganisation"
    ADD CONSTRAINT "LoreOrganisation_pkey" PRIMARY KEY (id);


--
-- Name: LorePerson LorePerson_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LorePerson"
    ADD CONSTRAINT "LorePerson_pkey" PRIMARY KEY (id);


--
-- Name: LorePlace LorePlace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LorePlace"
    ADD CONSTRAINT "LorePlace_pkey" PRIMARY KEY (id);


--
-- Name: Lore Lore_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lore"
    ADD CONSTRAINT "Lore_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationCity OrganisationCity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationCity"
    ADD CONSTRAINT "OrganisationCity_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationKingdom OrganisationKingdom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationKingdom"
    ADD CONSTRAINT "OrganisationKingdom_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationMember OrganisationMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationMember"
    ADD CONSTRAINT "OrganisationMember_pkey" PRIMARY KEY (id);


--
-- Name: OrganisationPlace OrganisationPlace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationPlace"
    ADD CONSTRAINT "OrganisationPlace_pkey" PRIMARY KEY (id);


--
-- Name: Organisation Organisation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organisation"
    ADD CONSTRAINT "Organisation_pkey" PRIMARY KEY (id);


--
-- Name: PersonOfInterest PersonOfInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_pkey" PRIMARY KEY (id);


--
-- Name: Place Place_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_pkey" PRIMARY KEY (id);


--
-- Name: Position Position_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: LoreCity_loreId_cityId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LoreCity_loreId_cityId_key" ON public."LoreCity" USING btree ("loreId", "cityId");


--
-- Name: LoreKingdom_loreId_kingdomId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LoreKingdom_loreId_kingdomId_key" ON public."LoreKingdom" USING btree ("loreId", "kingdomId");


--
-- Name: LoreOrganisation_loreId_organisationId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LoreOrganisation_loreId_organisationId_key" ON public."LoreOrganisation" USING btree ("loreId", "organisationId");


--
-- Name: LorePerson_loreId_personId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LorePerson_loreId_personId_key" ON public."LorePerson" USING btree ("loreId", "personId");


--
-- Name: LorePlace_loreId_placeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LorePlace_loreId_placeId_key" ON public."LorePlace" USING btree ("loreId", "placeId");


--
-- Name: OrganisationCity_organisationId_cityId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrganisationCity_organisationId_cityId_key" ON public."OrganisationCity" USING btree ("organisationId", "cityId");


--
-- Name: OrganisationKingdom_organisationId_kingdomId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrganisationKingdom_organisationId_kingdomId_key" ON public."OrganisationKingdom" USING btree ("organisationId", "kingdomId");


--
-- Name: OrganisationMember_organisationId_personId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrganisationMember_organisationId_personId_key" ON public."OrganisationMember" USING btree ("organisationId", "personId");


--
-- Name: OrganisationPlace_organisationId_placeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrganisationPlace_organisationId_placeId_key" ON public."OrganisationPlace" USING btree ("organisationId", "placeId");


--
-- Name: Position_cityId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Position_cityId_key" ON public."Position" USING btree ("cityId");


--
-- Name: Position_kingdomId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Position_kingdomId_key" ON public."Position" USING btree ("kingdomId");


--
-- Name: Position_personOfInterestId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Position_personOfInterestId_key" ON public."Position" USING btree ("personOfInterestId");


--
-- Name: Position_placeId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Position_placeId_key" ON public."Position" USING btree ("placeId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: City City_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."City"
    ADD CONSTRAINT "City_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."District"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_personOfInterestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_personOfInterestId_fkey" FOREIGN KEY ("personOfInterestId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: District District_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."District"
    ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LoreCity LoreCity_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreCity"
    ADD CONSTRAINT "LoreCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreCity LoreCity_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreCity"
    ADD CONSTRAINT "LoreCity_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreKingdom LoreKingdom_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreKingdom"
    ADD CONSTRAINT "LoreKingdom_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreKingdom LoreKingdom_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreKingdom"
    ADD CONSTRAINT "LoreKingdom_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreOrganisation LoreOrganisation_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreOrganisation"
    ADD CONSTRAINT "LoreOrganisation_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LoreOrganisation LoreOrganisation_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LoreOrganisation"
    ADD CONSTRAINT "LoreOrganisation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePerson LorePerson_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LorePerson"
    ADD CONSTRAINT "LorePerson_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePerson LorePerson_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LorePerson"
    ADD CONSTRAINT "LorePerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePlace LorePlace_loreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LorePlace"
    ADD CONSTRAINT "LorePlace_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES public."Lore"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LorePlace LorePlace_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LorePlace"
    ADD CONSTRAINT "LorePlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationCity OrganisationCity_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationCity"
    ADD CONSTRAINT "OrganisationCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationCity OrganisationCity_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationCity"
    ADD CONSTRAINT "OrganisationCity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationKingdom OrganisationKingdom_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationKingdom"
    ADD CONSTRAINT "OrganisationKingdom_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationKingdom OrganisationKingdom_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationKingdom"
    ADD CONSTRAINT "OrganisationKingdom_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationMember OrganisationMember_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationMember"
    ADD CONSTRAINT "OrganisationMember_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationMember OrganisationMember_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationMember"
    ADD CONSTRAINT "OrganisationMember_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationPlace OrganisationPlace_organisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationPlace"
    ADD CONSTRAINT "OrganisationPlace_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrganisationPlace OrganisationPlace_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrganisationPlace"
    ADD CONSTRAINT "OrganisationPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Organisation Organisation_parentOrganisationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organisation"
    ADD CONSTRAINT "Organisation_parentOrganisationId_fkey" FOREIGN KEY ("parentOrganisationId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."District"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PersonOfInterest PersonOfInterest_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PersonOfInterest"
    ADD CONSTRAINT "PersonOfInterest_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Place Place_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Place Place_districtId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES public."District"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Place Place_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Place"
    ADD CONSTRAINT "Place_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_cityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES public."City"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_kingdomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES public."Kingdom"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_personOfInterestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_personOfInterestId_fkey" FOREIGN KEY ("personOfInterestId") REFERENCES public."PersonOfInterest"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Position Position_placeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Position"
    ADD CONSTRAINT "Position_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES public."Place"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

