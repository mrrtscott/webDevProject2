--- PASSWORD: 12345678 ---

-- Database: webDevProject2

-- DROP DATABASE "webDevProject2";

CREATE DATABASE "webDevProject2"
    WITH 
    OWNER = webdev
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE "webDevProject2"
    IS 'This database is used for Photogram';





-- SCHEMA: public

-- DROP SCHEMA public ;

CREATE SCHEMA public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;










-- Table: public."Posts"

-- DROP TABLE public."Posts";

CREATE TABLE public."Posts"
(
    id integer NOT NULL,
    user_id integer,
    photo text COLLATE pg_catalog."default",
    caption text COLLATE pg_catalog."default",
    created_on timestamp with time zone,
    CONSTRAINT "Posts_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Posts"
    OWNER to webdev;
COMMENT ON TABLE public."Posts"
    IS 'This database stores post for the application';



-- Table: public."Likes"

-- DROP TABLE public."Likes";

CREATE TABLE public."Likes"
(
    id integer NOT NULL,
    user_id text COLLATE pg_catalog."default",
    post_id text COLLATE pg_catalog."default",
    CONSTRAINT "Likes_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Likes"
    OWNER to webdev;
COMMENT ON TABLE public."Likes"
    IS 'This table stores the likes data of the application';



-- Table: public."Follows"

-- DROP TABLE public."Follows";

CREATE TABLE public."Follows"
(
    id integer NOT NULL,
    user_id text COLLATE pg_catalog."default",
    follower_id text COLLATE pg_catalog."default",
    CONSTRAINT "Follows_pkey" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Follows"
    OWNER to webdev;
COMMENT ON TABLE public."Follows"
    IS 'This table stores the follow information for the application';