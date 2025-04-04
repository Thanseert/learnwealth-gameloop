
-- This file contains the SQL that needs to be executed to create the lesson_content table
-- Run this SQL in the Supabase SQL editor

CREATE TABLE public.lesson_content (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT[] NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comment to the table
COMMENT ON TABLE public.lesson_content IS 'Stores content for sub-lessons within each main lesson';
