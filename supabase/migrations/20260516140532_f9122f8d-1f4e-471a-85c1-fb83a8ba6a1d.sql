
-- Remove student SELECT policy on test_options to prevent is_correct leakage
DROP POLICY IF EXISTS "Students can view options for registered tests" ON public.test_options;

-- Safe RPC for students: returns options without is_correct
CREATE OR REPLACE FUNCTION public.get_test_options_safe(p_test_id uuid)
RETURNS TABLE (
  id uuid,
  question_id uuid,
  option_text text,
  option_order integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT o.id, o.question_id, o.option_text, o.option_order
  FROM public.test_options o
  JOIN public.test_questions q ON q.id = o.question_id
  WHERE q.test_id = p_test_id
    AND (
      EXISTS (
        SELECT 1 FROM public.test_registrations tr
        WHERE tr.test_id = p_test_id AND tr.student_id = auth.uid()
      )
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
$$;

REVOKE ALL ON FUNCTION public.get_test_options_safe(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_test_options_safe(uuid) TO authenticated;
