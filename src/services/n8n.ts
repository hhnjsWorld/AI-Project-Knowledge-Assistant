import { config } from '@/lib/config';

/**
 * n8n Service
 * 
 * The Single Gateway for all AI workflows.
 * Frontend MUST NOT contact OpenAI/Anthropic directly.
 * All traffic goes through here -> n8n Webhook.
 */

export interface AIWorkflowRequest {
  workflowId: string;
  payload: Record<string, unknown>;
}

export interface AIWorkflowResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const n8nService = {
  /**
   * Invoke an AI workflow via n8n
   * @param workflowId - The ID or slug of the specific n8n workflow
   * @param payload - The data to send to the workflow
   */
  async invokeWorkflow<T>(workflowId: string, payload: Record<string, unknown>): Promise<AIWorkflowResponse<T>> {
    const url = config.ai.n8nWebhookUrl ? `${config.ai.n8nWebhookUrl}/${workflowId}` : '';

    if (!url) {
       console.warn('[n8n] Webhook URL is not configured.');
       return { success: false, error: 'n8n Configuration Missing' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`n8n responded with ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error('[n8n] Workflow execution failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown network error' 
      };
    }
  }
};
