module MathFilter
  def modulus(input, operand)
    to_number(input) % to_number(operand)
  end
end

Liquid::Template.register_filter(MathFilter)