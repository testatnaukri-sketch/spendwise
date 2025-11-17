-- Create function to increment goal amount
CREATE OR REPLACE FUNCTION increment_goal_amount(
  goal_id UUID,
  amount_to_add NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE goals
  SET current_amount = current_amount + amount_to_add
  WHERE id = goal_id;
END;
$$;
