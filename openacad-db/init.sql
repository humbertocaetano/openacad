
create database openacad;
create user openacad with encrypted password 'abcd';
GRANT ALL PRIVILEGES ON DATABASE openacad TO openacad;
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-0+deb12u1)
-- Dumped by pg_dump version 15.8 (Debian 15.8-0+deb12u1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendances (
    id integer NOT NULL,
    present boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    lesson_content_id integer,
    student_id integer NOT NULL
);


ALTER TABLE public.attendances OWNER TO postgres;

--
-- Name: attendances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendances_id_seq OWNER TO postgres;

--
-- Name: attendances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendances_id_seq OWNED BY public.attendances.id;


--
-- Name: class_divisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_divisions (
    id integer NOT NULL,
    name character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.class_divisions OWNER TO postgres;

--
-- Name: class_divisions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.class_divisions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.class_divisions_id_seq OWNER TO postgres;

--
-- Name: class_divisions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.class_divisions_id_seq OWNED BY public.class_divisions.id;


--
-- Name: class_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_schedules (
    id integer NOT NULL,
    teacher_subject_id integer NOT NULL,
    weekday integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.class_schedules OWNER TO postgres;

--
-- Name: class_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.class_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.class_schedules_id_seq OWNER TO postgres;

--
-- Name: class_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.class_schedules_id_seq OWNED BY public.class_schedules.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    id integer NOT NULL,
    year_id integer NOT NULL,
    division_id integer NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- Name: classes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.classes_id_seq OWNER TO postgres;

--
-- Name: classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classes_id_seq OWNED BY public.classes.id;


--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    student_subject_id integer NOT NULL,
    evaluation_type character varying(50) NOT NULL,
    grade numeric(4,2) NOT NULL,
    weight numeric(3,2) DEFAULT 1.0,
    date date NOT NULL,
    observations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT grades_grade_check CHECK (((grade >= (0)::numeric) AND (grade <= (10)::numeric)))
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- Name: grades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grades_id_seq OWNER TO postgres;

--
-- Name: grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grades_id_seq OWNED BY public.grades.id;


--
-- Name: knowledge_areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_areas (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.knowledge_areas OWNER TO postgres;

--
-- Name: knowledge_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knowledge_areas_id_seq OWNER TO postgres;

--
-- Name: knowledge_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_areas_id_seq OWNED BY public.knowledge_areas.id;


--
-- Name: lesson_contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_contents (
    id integer NOT NULL,
    teacher_subject_id integer NOT NULL,
    date date NOT NULL,
    content text NOT NULL,
    observations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    objective text,
    resources text,
    evaluation_method text
);


ALTER TABLE public.lesson_contents OWNER TO postgres;

--
-- Name: lesson_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lesson_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lesson_contents_id_seq OWNER TO postgres;

--
-- Name: lesson_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lesson_contents_id_seq OWNED BY public.lesson_contents.id;


--
-- Name: non_school_days; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.non_school_days (
    id integer NOT NULL,
    school_term_id integer,
    start_date date NOT NULL,
    end_date date NOT NULL,
    description character varying(100),
    type character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT non_school_days_type_check CHECK (((type)::text = ANY ((ARRAY['HOLIDAY'::character varying, 'VACATION'::character varying])::text[])))
);


ALTER TABLE public.non_school_days OWNER TO postgres;

--
-- Name: non_school_days_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.non_school_days_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.non_school_days_id_seq OWNER TO postgres;

--
-- Name: non_school_days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.non_school_days_id_seq OWNED BY public.non_school_days.id;


--
-- Name: school_terms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_terms (
    id integer NOT NULL,
    year integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.school_terms OWNER TO postgres;

--
-- Name: school_terms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_terms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.school_terms_id_seq OWNER TO postgres;

--
-- Name: school_terms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_terms_id_seq OWNED BY public.school_terms.id;


--
-- Name: school_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_years (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.school_years OWNER TO postgres;

--
-- Name: school_years_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_years_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.school_years_id_seq OWNER TO postgres;

--
-- Name: school_years_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_years_id_seq OWNED BY public.school_years.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.schools OWNER TO postgres;

--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schools_id_seq OWNER TO postgres;

--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: student_subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_subjects (
    id integer NOT NULL,
    student_id integer NOT NULL,
    teacher_subject_id integer NOT NULL,
    status character varying(20) DEFAULT 'CURSANDO'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_subjects OWNER TO postgres;

--
-- Name: student_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_subjects_id_seq OWNER TO postgres;

--
-- Name: student_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_subjects_id_seq OWNED BY public.student_subjects.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    user_id integer,
    class_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    registration character varying(20) NOT NULL,
    birth_date date,
    guardian_name character varying(100),
    guardian_phone character varying(20),
    guardian_email character varying(100),
    address text,
    health_info text,
    notes text,
    active boolean DEFAULT true,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    year_id integer NOT NULL,
    knowledge_area_id integer,
    objective text,
    syllabus text,
    basic_bibliography text,
    complementary_bibliography text,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hours_per_year integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subjects_id_seq OWNER TO postgres;

--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: teacher_subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_subjects (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    subject_id integer NOT NULL,
    year integer NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    division_id integer
);


ALTER TABLE public.teacher_subjects OWNER TO postgres;

--
-- Name: teacher_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teacher_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teacher_subjects_id_seq OWNER TO postgres;

--
-- Name: teacher_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teacher_subjects_id_seq OWNED BY public.teacher_subjects.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: teachers_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers_classes (
    teacher_id integer NOT NULL,
    class_id integer NOT NULL
);


ALTER TABLE public.teachers_classes OWNER TO postgres;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teachers_id_seq OWNER TO postgres;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: user_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_levels (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_levels OWNER TO postgres;

--
-- Name: user_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_levels_id_seq OWNER TO postgres;

--
-- Name: user_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_levels_id_seq OWNED BY public.user_levels.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    school_id integer,
    level_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: attendances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances ALTER COLUMN id SET DEFAULT nextval('public.attendances_id_seq'::regclass);


--
-- Name: class_divisions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_divisions ALTER COLUMN id SET DEFAULT nextval('public.class_divisions_id_seq'::regclass);


--
-- Name: class_schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules ALTER COLUMN id SET DEFAULT nextval('public.class_schedules_id_seq'::regclass);


--
-- Name: classes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes ALTER COLUMN id SET DEFAULT nextval('public.classes_id_seq'::regclass);


--
-- Name: grades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades ALTER COLUMN id SET DEFAULT nextval('public.grades_id_seq'::regclass);


--
-- Name: knowledge_areas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_areas ALTER COLUMN id SET DEFAULT nextval('public.knowledge_areas_id_seq'::regclass);


--
-- Name: lesson_contents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_contents ALTER COLUMN id SET DEFAULT nextval('public.lesson_contents_id_seq'::regclass);


--
-- Name: non_school_days id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.non_school_days ALTER COLUMN id SET DEFAULT nextval('public.non_school_days_id_seq'::regclass);


--
-- Name: school_terms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_terms ALTER COLUMN id SET DEFAULT nextval('public.school_terms_id_seq'::regclass);


--
-- Name: school_years id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_years ALTER COLUMN id SET DEFAULT nextval('public.school_years_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: student_subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_subjects ALTER COLUMN id SET DEFAULT nextval('public.student_subjects_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: teacher_subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects ALTER COLUMN id SET DEFAULT nextval('public.teacher_subjects_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Name: user_levels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_levels ALTER COLUMN id SET DEFAULT nextval('public.user_levels_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: attendances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendances (id, present, created_at, updated_at, lesson_content_id, student_id) FROM stdin;
\.


--
-- Data for Name: class_divisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_divisions (id, name, created_at) FROM stdin;
1	A	2024-11-20 11:49:36.059702
2	B	2024-11-20 11:49:36.059702
3	C	2024-11-20 11:49:36.059702
4	D	2024-11-20 11:49:36.059702
5	E	2024-11-20 11:49:36.059702
\.


--
-- Data for Name: class_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_schedules (id, teacher_subject_id, weekday, start_time, end_time, created_at) FROM stdin;
7	8	1	08:00:00	12:00:00	2024-11-26 20:07:10.537855
8	9	1	12:00:00	13:00:00	2024-11-27 06:07:03.965588
9	10	2	08:00:00	10:00:00	2024-11-27 06:16:53.42338
10	11	2	08:00:00	12:00:00	2024-11-27 10:29:07.126457
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (id, year_id, division_id, active, created_at) FROM stdin;
1	1	1	t	2024-11-20 11:50:08.07401
2	1	2	t	2024-11-20 11:50:21.221433
3	2	1	t	2024-11-25 11:21:48.40524
5	2	2	t	2024-11-26 15:40:05.240914
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (id, student_subject_id, evaluation_type, grade, weight, date, observations, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: knowledge_areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.knowledge_areas (id, name, created_at) FROM stdin;
1	Linguagens	2024-11-24 19:04:11.347803
2	Matemática	2024-11-24 19:04:11.347803
3	Ciências da Natureza	2024-11-24 19:04:11.347803
4	Ciências Humanas	2024-11-24 19:04:11.347803
5	Ensino Religioso	2024-11-24 19:04:11.347803
\.


--
-- Data for Name: lesson_contents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_contents (id, teacher_subject_id, date, content, observations, created_at, updated_at, objective, resources, evaluation_method) FROM stdin;
1	10	2024-11-05	Introdução		2024-11-29 06:47:10.238185	2024-11-29 06:47:10.238185	Introdução	Quadro	Aula
2	8	2024-12-02	12345		2024-11-30 10:25:15.63276	2024-11-30 10:25:15.63276	Testar	Quadro	Aula
3	8	2024-12-09	Teste realizado		2024-11-30 20:50:52.819784	2024-11-30 20:50:52.819784	Testar Frequência	Foi	Aula
\.


--
-- Data for Name: non_school_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.non_school_days (id, school_term_id, start_date, end_date, description, type, created_at) FROM stdin;
\.


--
-- Data for Name: school_terms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_terms (id, year, start_date, end_date, created_at) FROM stdin;
\.


--
-- Data for Name: school_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_years (id, name, created_at) FROM stdin;
1	1º Ano	2024-11-20 11:49:24.091657
2	2º Ano	2024-11-20 11:49:24.091657
3	3º Ano	2024-11-20 11:49:24.091657
4	4º Ano	2024-11-20 11:49:24.091657
5	5º Ano	2024-11-20 11:49:24.091657
6	6º Ano	2024-11-20 11:49:24.091657
7	7º Ano	2024-11-20 11:49:24.091657
8	8º Ano	2024-11-20 11:49:24.091657
9	9º Ano	2024-11-20 11:49:24.091657
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schools (id, code, name, created_at) FROM stdin;
1	SCHOOL001	Escola Teste	2024-11-16 14:48:31.613866
\.


--
-- Data for Name: student_subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_subjects (id, student_id, teacher_subject_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, user_id, class_id, created_at, registration, birth_date, guardian_name, guardian_phone, guardian_email, address, health_info, notes, active, updated_at) FROM stdin;
2	11	1	2024-11-25 12:47:15.867557	202401014902	1974-10-10	Humberto	813222222	\N	\N	\N	\N	t	2024-11-26 15:38:29.073823
4	16	2	2024-11-27 20:35:32.402686	202401018423	2000-01-01	\N	\N	\N	\N	\N	\N	t	2024-11-27 20:35:32.402686
1	8	2	2024-11-25 12:08:23.614725	01010101	1993-09-18	\N	\N	\N	\N	\N	\N	t	2024-11-27 20:36:41.21429
3	15	3	2024-11-26 15:40:45.579382	202401012564	1999-10-10	\N	\N	\N	\N	\N	\N	t	2024-11-30 16:17:03.314807
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, year_id, knowledge_area_id, objective, syllabus, basic_bibliography, complementary_bibliography, active, created_at, updated_at, hours_per_year) FROM stdin;
7	Matemática	2	2					t	2024-11-25 11:20:29.290952	2024-11-25 11:20:29.290952	0
12	Inglês - Língua Estrangeira Moderna	1	1					t	2024-11-26 15:00:56.593975	2024-11-26 15:05:47.868121	40
10	História	1	4					t	2024-11-26 14:49:48.188576	2024-11-26 15:06:07.475694	80
11	Educação Física	1	4					t	2024-11-26 14:54:55.547806	2024-11-26 15:06:30.432007	120
9	Geografia	1	4					t	2024-11-26 06:45:50.232459	2024-11-26 15:07:14.314952	80
8	Matemática	1	2					t	2024-11-25 11:21:37.040307	2024-11-26 15:07:35.306486	280
\.


--
-- Data for Name: teacher_subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_subjects (id, teacher_id, subject_id, year, active, created_at, updated_at, division_id) FROM stdin;
8	1	8	2024	t	2024-11-26 20:07:10.537855	2024-11-26 20:07:10.537855	1
9	2	12	2024	t	2024-11-27 06:07:03.965588	2024-11-27 06:07:03.965588	1
10	3	9	2024	t	2024-11-27 06:16:53.42338	2024-11-27 06:16:53.42338	2
11	1	7	2024	t	2024-11-27 10:29:07.126457	2024-11-27 10:29:07.126457	1
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, user_id, created_at) FROM stdin;
1	6	2024-11-25 23:26:58.898321
2	12	2024-11-25 23:29:08.483667
3	13	2024-11-27 06:16:53.419964
\.


--
-- Data for Name: teachers_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers_classes (teacher_id, class_id) FROM stdin;
\.


--
-- Data for Name: user_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_levels (id, name, description, created_at, updated_at) FROM stdin;
1	Administrador(a)	Acesso total ao sistema	2024-11-20 10:26:52.334284	2024-11-20 10:26:52.334284
2	Professor(a)	Acesso às funcionalidades de professor	2024-11-20 10:26:52.334284	2024-11-20 10:26:52.334284
3	Secretário(a)	Acesso às funcionalidades administrativas básicas	2024-11-20 10:26:52.334284	2024-11-20 10:26:52.334284
4	Aluno	\N	2024-11-25 11:47:54.073635	2024-11-25 11:47:54.073635
5	Coordenador(a)	Nível de Coordenadores	2024-11-26 14:19:57.076524	2024-11-26 14:19:57.076524
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, username, email, phone, password_hash, created_at, school_id, level_id) FROM stdin;
1	Administrador	admin	admin@openacad.com	00000000000	$2b$10$YxlY3fLmY/bFP1xMsOqv3.WmhoMdSoNsXKLcOz1adRxGDUcK.sChq	2024-11-14 15:20:04.4911	1	1
5	Humberto Caetano	humbertoccs	humberto.ccs@gmail.com	8132222222	$2b$10$FnkFrWYbzzbR2maiZpqU0.sUC/hksXrOm1t6oKcS3WUs7jcb31yQm	2024-11-17 09:37:42.520529	\N	3
11	Taciana de Menezes Cardoso da Silva	taciana.silva.7273	taciana@gmail.com	8132222222	202401014902	2024-11-25 12:47:15.867557	\N	4
12	Paulo da Silva	pds	paulo@gmail.com	8132222222	$2b$10$IYZKKnDE3.bM2ELgDyCgZ.SjtYtFAUpp7ZMGt0cS00CqZgfjzHzx2	2024-11-25 23:01:58.374778	\N	2
13	Pedro da Silva	pedrods	pedro@gmail.com	8132222222	$2b$10$ecpY0t1ItYSAGqoWbf99h.NQrAMGoCj4E/.7elLsb0DpSsy68a0Rm	2024-11-26 13:47:13.041407	\N	2
14	Jaime Silva	jaimes	jaime@gmail.com	8132222222	$2b$10$oFgFlReujBMLfwgezJo.1uQbo9gTv3VRbwgC8gYQsM/xV7KMDFLLu	2024-11-26 14:20:38.617876	\N	5
6	Camilla	camilladmcds	camilla@gmail.com	8132222221	$2b$10$Oa3VPD9IlXoijpp9Y0umq.7WPsDLrBT1iDoM.af8qPfHyXt9Jds8G	2024-11-20 10:23:45.12082	\N	2
16	Marcos Silva	marcos.silva.6104	marcoss@gmail.com	81333333333	202401018423	2024-11-27 20:35:32.402686	\N	4
8	Fillipe de Menezes Cardoso da Silva	fillipe.silva.3732	fillipedmcds@gmail.com	8132222220	01010101	2024-11-25 12:08:23.614725	\N	4
15	Pedro Paulo Cardoso	pedro.cardoso.5245	pedropc@gmail.com	8199999999	202401012564	2024-11-26 15:40:45.579382	\N	4
\.


--
-- Name: attendances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendances_id_seq', 1, false);


--
-- Name: class_divisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_divisions_id_seq', 5, true);


--
-- Name: class_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_schedules_id_seq', 10, true);


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classes_id_seq', 5, true);


--
-- Name: grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grades_id_seq', 1, false);


--
-- Name: knowledge_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knowledge_areas_id_seq', 5, true);


--
-- Name: lesson_contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lesson_contents_id_seq', 3, true);


--
-- Name: non_school_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.non_school_days_id_seq', 1, false);


--
-- Name: school_terms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_terms_id_seq', 1, false);


--
-- Name: school_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_years_id_seq', 9, true);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schools_id_seq', 1, true);


--
-- Name: student_subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_subjects_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 4, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 12, true);


--
-- Name: teacher_subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_subjects_id_seq', 11, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_id_seq', 3, true);


--
-- Name: user_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_levels_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: class_divisions class_divisions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_divisions
    ADD CONSTRAINT class_divisions_name_key UNIQUE (name);


--
-- Name: class_divisions class_divisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_divisions
    ADD CONSTRAINT class_divisions_pkey PRIMARY KEY (id);


--
-- Name: class_schedules class_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: classes classes_year_id_division_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_year_id_division_id_key UNIQUE (year_id, division_id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: knowledge_areas knowledge_areas_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_areas
    ADD CONSTRAINT knowledge_areas_name_key UNIQUE (name);


--
-- Name: knowledge_areas knowledge_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_areas
    ADD CONSTRAINT knowledge_areas_pkey PRIMARY KEY (id);


--
-- Name: lesson_contents lesson_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_contents
    ADD CONSTRAINT lesson_contents_pkey PRIMARY KEY (id);


--
-- Name: non_school_days non_school_days_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.non_school_days
    ADD CONSTRAINT non_school_days_pkey PRIMARY KEY (id);


--
-- Name: school_terms school_terms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_terms
    ADD CONSTRAINT school_terms_pkey PRIMARY KEY (id);


--
-- Name: school_years school_years_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_years
    ADD CONSTRAINT school_years_name_key UNIQUE (name);


--
-- Name: school_years school_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_years
    ADD CONSTRAINT school_years_pkey PRIMARY KEY (id);


--
-- Name: schools schools_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_code_key UNIQUE (code);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: student_subjects student_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_pkey PRIMARY KEY (id);


--
-- Name: student_subjects student_subjects_student_id_teacher_subject_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_student_id_teacher_subject_id_key UNIQUE (student_id, teacher_subject_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: students students_registration_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_registration_key UNIQUE (registration);


--
-- Name: subjects subjects_name_year_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_name_year_id_key UNIQUE (name, year_id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teacher_subjects teacher_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_pkey PRIMARY KEY (id);


--
-- Name: teacher_subjects teacher_subjects_teacher_id_subject_id_year_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_teacher_id_subject_id_year_key UNIQUE (teacher_id, subject_id, year);


--
-- Name: teachers_classes teachers_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers_classes
    ADD CONSTRAINT teachers_classes_pkey PRIMARY KEY (teacher_id, class_id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: class_schedules unique_teacher_time; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT unique_teacher_time UNIQUE (teacher_subject_id, weekday, start_time);


--
-- Name: user_levels user_levels_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_levels
    ADD CONSTRAINT user_levels_name_key UNIQUE (name);


--
-- Name: user_levels user_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_levels
    ADD CONSTRAINT user_levels_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_class_schedules_teacher_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_class_schedules_teacher_time ON public.class_schedules USING btree (teacher_subject_id, weekday, start_time, end_time);


--
-- Name: idx_grades_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grades_date ON public.grades USING btree (date);


--
-- Name: idx_grades_student_subject; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grades_student_subject ON public.grades USING btree (student_subject_id);


--
-- Name: idx_lesson_contents_teacher_subject; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lesson_contents_teacher_subject ON public.lesson_contents USING btree (teacher_subject_id);


--
-- Name: idx_non_school_days_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_non_school_days_dates ON public.non_school_days USING btree (start_date, end_date);


--
-- Name: idx_school_terms_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_school_terms_year ON public.school_terms USING btree (year);


--
-- Name: idx_student_subjects_student; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_subjects_student ON public.student_subjects USING btree (student_id);


--
-- Name: idx_student_subjects_teacher_subject; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_subjects_teacher_subject ON public.student_subjects USING btree (teacher_subject_id);


--
-- Name: idx_students_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_class_id ON public.students USING btree (class_id);


--
-- Name: idx_students_registration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_registration ON public.students USING btree (registration);


--
-- Name: idx_students_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_user_id ON public.students USING btree (user_id);


--
-- Name: idx_teacher_subjects_subject; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_teacher_subjects_subject ON public.teacher_subjects USING btree (subject_id);


--
-- Name: idx_teacher_subjects_teacher; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_teacher_subjects_teacher ON public.teacher_subjects USING btree (teacher_id);


--
-- Name: idx_teacher_subjects_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_teacher_subjects_year ON public.teacher_subjects USING btree (year);


--
-- Name: idx_users_level_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_level_id ON public.users USING btree (level_id);


--
-- Name: idx_users_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_school_id ON public.users USING btree (school_id);


--
-- Name: class_schedules class_schedules_teacher_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_schedules
    ADD CONSTRAINT class_schedules_teacher_subject_id_fkey FOREIGN KEY (teacher_subject_id) REFERENCES public.teacher_subjects(id);


--
-- Name: classes classes_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.class_divisions(id);


--
-- Name: classes classes_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_year_id_fkey FOREIGN KEY (year_id) REFERENCES public.school_years(id);


--
-- Name: attendances fk_lesson_content; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT fk_lesson_content FOREIGN KEY (lesson_content_id) REFERENCES public.lesson_contents(id);


--
-- Name: attendances fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: users fk_user_level; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_level FOREIGN KEY (level_id) REFERENCES public.user_levels(id);


--
-- Name: grades grades_student_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_subject_id_fkey FOREIGN KEY (student_subject_id) REFERENCES public.student_subjects(id);


--
-- Name: lesson_contents lesson_contents_teacher_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_contents
    ADD CONSTRAINT lesson_contents_teacher_subject_id_fkey FOREIGN KEY (teacher_subject_id) REFERENCES public.teacher_subjects(id);


--
-- Name: non_school_days non_school_days_school_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.non_school_days
    ADD CONSTRAINT non_school_days_school_term_id_fkey FOREIGN KEY (school_term_id) REFERENCES public.school_terms(id);


--
-- Name: student_subjects student_subjects_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: student_subjects student_subjects_teacher_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_subjects
    ADD CONSTRAINT student_subjects_teacher_subject_id_fkey FOREIGN KEY (teacher_subject_id) REFERENCES public.teacher_subjects(id);


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: subjects subjects_knowledge_area_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_knowledge_area_id_fkey FOREIGN KEY (knowledge_area_id) REFERENCES public.knowledge_areas(id);


--
-- Name: subjects subjects_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_year_id_fkey FOREIGN KEY (year_id) REFERENCES public.school_years(id);


--
-- Name: teacher_subjects teacher_subjects_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.class_divisions(id);


--
-- Name: teacher_subjects teacher_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: teacher_subjects teacher_subjects_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teachers_classes teachers_classes_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers_classes
    ADD CONSTRAINT teachers_classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: TABLE attendances; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.attendances TO openacad;


--
-- Name: SEQUENCE attendances_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.attendances_id_seq TO openacad;


--
-- Name: TABLE class_divisions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.class_divisions TO openacad;


--
-- Name: SEQUENCE class_divisions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.class_divisions_id_seq TO openacad;


--
-- Name: TABLE class_schedules; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.class_schedules TO openacad;


--
-- Name: SEQUENCE class_schedules_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.class_schedules_id_seq TO openacad;


--
-- Name: TABLE classes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.classes TO openacad;


--
-- Name: SEQUENCE classes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.classes_id_seq TO openacad;


--
-- Name: TABLE grades; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.grades TO openacad;


--
-- Name: SEQUENCE grades_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.grades_id_seq TO openacad;


--
-- Name: TABLE knowledge_areas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.knowledge_areas TO openacad;


--
-- Name: SEQUENCE knowledge_areas_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.knowledge_areas_id_seq TO openacad;


--
-- Name: TABLE lesson_contents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lesson_contents TO openacad;


--
-- Name: SEQUENCE lesson_contents_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lesson_contents_id_seq TO openacad;


--
-- Name: SEQUENCE non_school_days_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.non_school_days_id_seq TO openacad;


--
-- Name: SEQUENCE school_terms_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_terms_id_seq TO openacad;


--
-- Name: TABLE school_years; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_years TO openacad;


--
-- Name: SEQUENCE school_years_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_years_id_seq TO openacad;


--
-- Name: TABLE schools; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.schools TO openacad;


--
-- Name: SEQUENCE schools_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.schools_id_seq TO openacad;


--
-- Name: TABLE student_subjects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_subjects TO openacad;


--
-- Name: SEQUENCE student_subjects_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.student_subjects_id_seq TO openacad;


--
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO openacad;


--
-- Name: SEQUENCE students_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.students_id_seq TO openacad;


--
-- Name: TABLE subjects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subjects TO openacad;


--
-- Name: SEQUENCE subjects_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.subjects_id_seq TO openacad;


--
-- Name: TABLE teacher_subjects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teacher_subjects TO openacad;


--
-- Name: SEQUENCE teacher_subjects_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.teacher_subjects_id_seq TO openacad;


--
-- Name: TABLE teachers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teachers TO openacad;


--
-- Name: TABLE teachers_classes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teachers_classes TO openacad;


--
-- Name: SEQUENCE teachers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.teachers_id_seq TO openacad;


--
-- Name: TABLE user_levels; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_levels TO openacad;


--
-- Name: SEQUENCE user_levels_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_levels_id_seq TO openacad;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO openacad;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO openacad;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO openacad;


--
-- PostgreSQL database dump complete
--

