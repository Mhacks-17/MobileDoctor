import openai

# Replace with your own OpenAI API key
openai.api_key = "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"

# Define the prompt you want to send
prompt = "Tell me a fun fact about space."

# Make a call to the OpenAI API
response = openai.Completion.create(
  engine="text-davinci-002",  # You can also use 'gpt-3.5-turbo' or other models
  prompt=prompt,
  max_tokens=100  # Limits the length of the response
)

# Print the response from OpenAI
print(response.choices[0].text.strip())