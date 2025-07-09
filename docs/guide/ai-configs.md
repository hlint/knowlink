# AI Service Configuration

Knowlink supports multiple AI service providers, allowing you to choose the most suitable service based on your needs. Most AI service configurations can be managed in the settings page.

![AI Configuration Interface](/ai_configs.png)

## LLM Service Configuration

### Supported Providers

Knowlink supports all LLM providers that use the **OpenAI API format**, including but not limited to:

- **OpenAI** (GPT-3.5, GPT-4)
- **Google Gemini** (Recommended)
- **Anthropic Claude**
- **Azure OpenAI**
- **Locally deployed compatible services**

### Default Configuration

- **Default Provider**: pollinations.ai free API service
- **Recommended Choice**: Google Gemini
  - Provides free usage quota
  - Supports larger context windows
  - Fast response speed and high quality

### Configuration Steps

1. Go to **Settings** → **Service Configuration**
2. Select your preferred LLM provider
3. Enter the corresponding API key
4. Save configuration

## Image Generation Service

**Note**: Currently, the image generation feature only supports pollinations.ai's free service and does not support customizing other image generation providers.

## AI Tool Integration

### Web Search Tools

- **Web Search**: Real-time web information retrieval
  - Get latest news
  - Find reference materials
  - Verify information accuracy

### Image Resource Tools

- **Image Search**: High-quality image materials
  - Free commercial images
  - Multiple categories and tags
  - Supports keyword search

## AI Additional Instructions (Advanced Feature)

Through custom AI prompts, you can achieve a more personalized AI interaction experience.

![AI Instruction Configuration](/ai_instructions.png)

### Custom Features

- **Adjust AI Response Style**: Formal, friendly, professional, etc.
- **Set Specific Domain Knowledge**: Programming, writing, design, etc.
- **Define Interaction Rules**: Response length, format requirements, etc.
- **Optimize Workflow**: Optimize prompts for specific tasks

## Troubleshooting

### Common Issues

**Q: Still can't use after configuring API key?**
A: Please check if the API key is correct and if the provider account has sufficient balance.

**Q: Image generation failed?**
A: It might be a network issue or temporary provider failure, please try again later.

**Q: Poor AI response quality?**
A: You can try adjusting AI additional instructions or switch to other LLM providers.
