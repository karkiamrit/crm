// mailchimp.controller.ts
import {
  Controller,
  Get,
  Redirect,
  Query,
  Res,
  Body,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
@Controller()
export class MailchimpController {
  constructor(private readonly configService: ConfigService) {}
  private readonly BASE_URL = 'http://127.0.0.1:8003';
  private readonly OAUTH_CALLBACK = `${this.BASE_URL}/oauth/mailchimp/callback`;

  @Get()
  getHello(): string {
    return '<p>Welcome to the sample Mailchimp OAuth app! Click <a href="/auth/mailchimp">here</a> to log in</p>';
  }

  @Get('auth/mailchimp')
  @Redirect()
  async redirectToMailchimpAuth(): Promise<any> {
    console.log(this.configService.get('MAILCHIMP_CLIENT_ID'));
    return {
      url: `https://login.mailchimp.com/oauth2/authorize?${new URLSearchParams({
        response_type: 'code',
        client_id: this.configService.get('MAILCHIMP_CLIENT_ID'),
        redirect_uri: this.OAUTH_CALLBACK,
      })}`,
    };
  }

  @Get('oauth/mailchimp/callback')
  async handleMailchimpCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const tokenResponse = await fetch(
      'https://login.mailchimp.com/oauth2/token',
      {
        method: 'POST',
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.configService.get('MAILCHIMP_CLIENT_ID'),
          client_secret: this.configService.get('MAILCHIMP_CLIENT_SECRET'),
          redirect_uri: this.OAUTH_CALLBACK,
          code,
        }),
      },
    );
    console.log(tokenResponse);
    const { access_token } = await tokenResponse.json();

    const metadataResponse = await fetch(
      'https://login.mailchimp.com/oauth2/metadata',
      {
        headers: {
          Authorization: `OAuth ${access_token}`,
        },
      },
    );

    const { dc } = await metadataResponse.json();

    res.send(`
      <p>This user's access token is ${access_token} and their server prefix is ${dc}.</p>
    `);
  }

  // @Post('send-campaign')
  // async sendCampaign(@Body() body: any): Promise<void> {
  //   const { access_token, dc, campaignDetails, campaignContent } = body;

  //   // Create the campaign
  //   const createCampaignResponse = await fetch(
  //     `https://${dc}.api.mailchimp.com/3.0/campaigns`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `OAuth ${access_token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(campaignDetails),
  //     },
  //   );
  //   const { id: campaign_id } = await createCampaignResponse.json();

  //   // Add content to the campaign
  //   await fetch(
  //     `https://${dc}.api.mailchimp.com/3.0/campaigns/${campaign_id}/content`,
  //     {
  //       method: 'PUT',
  //       headers: {
  //         Authorization: `OAuth ${access_token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(campaignContent),
  //     },
  //   );

  //   // Send the campaign
  //   await fetch(
  //     `https://${dc}.api.mailchimp.com/3.0/campaigns/${campaign_id}/actions/send`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `OAuth ${access_token}`,
  //       },
  //     },
  //   );
  // }

  @Post('create-list')
  async createList(@Body() body: any): Promise<any> {
    const {
      access_token,
      dc,
      listName,
      permissionReminder,
      emailTypeOption,
      contact,
      campaignDefaults,
    } = body;

    const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists`, {
      method: 'POST',
      headers: {
        Authorization: `OAuth ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: listName,
        permission_reminder: permissionReminder,
        email_type_option: emailTypeOption,
        contact: contact,
        campaign_defaults: campaignDefaults,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating list:', error);
      throw new Error('Failed to create list');
    }

    const data = await response.json();
    const list_id = data.id;

    if (!list_id) {
      console.error('No list ID in response:', data);
      throw new Error('No list ID in response');
    }

    console.log(list_id);
    return { list_id };
  }

  @Post('add-members')
  async addMembers(@Body() body): Promise<any> {
    const { access_token, dc, listId, members } = body;
  
    try {
      const responses = await Promise.all(
        members.map(async (member: any) => {
          const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
            method: 'POST',
            headers: {
              Authorization: `OAuth ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email_address: member.email,
              status: 'subscribed', // or 'pending' if double opt-in is enabled
              merge_fields: { EMAIL: member.email }, // replace EMAIL merge tag with member's email
            }),
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add member. Mailchimp error: ${errorText}`);
          }
  
          return response;
        }),
      );
  
      return { status: 'Members added' };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  @Post('create-campaign')
  async createCampaign(@Body() body: any): Promise<any> {
    const { access_token, dc, campaignDetails } = body;

    try {
      const response = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/campaigns`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignDetails),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create campaign. Mailchimp error: ${errorText}`,
        );
      }

      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  @Post('add-content')
  async addContent(@Body() body: any): Promise<any> {
    const { access_token, dc, campaignId, content } = body;

    try {
      const response = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
        {
          method: 'PUT',
          headers: {
            Authorization: `OAuth ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(content),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error adding content:', error);
        throw new Error('Failed to add content');
      }

      return { status: 'Content added' };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  @Post('send-campaign')
  async sendCampaign(@Body() body:any): Promise<any> {
    const { access_token, dc, campaignId } = body;
  
    try {
      const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`, {
        method: 'POST',
        headers: {
          Authorization: `OAuth ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send campaign. Mailchimp error: ${errorText}`);
      }
  
      return { status: 'Campaign sent' };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  @Get('get-campaigns')
  async getCampaigns(@Query() query: any): Promise<any> {
    const { access_token, dc } = query;
    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/campaigns`,
      {
        headers: {
          Authorization: `OAuth ${access_token}`,
        },
      },
    );

    const { campaigns } = await response.json();

    return { campaigns };
  }

  @Get('get-lists')
  async getLists(@Query() query): Promise<any> {
    const { access_token, dc } = query;

    const response = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists`, {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
    });

    const { lists } = await response.json();

    return { lists };
  }

  @Get('get-members')
  async getMembers(@Query() query): Promise<any> {
    const { access_token, dc, listId } = query;

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        headers: {
          Authorization: `OAuth ${access_token}`,
        },
      },
    );

    const { members } = await response.json();

    return { members };
  }

  @Post('create-content')
  async createContent(@Body() body: any): Promise<any> {
    const { access_token, dc, campaignId, content } = body;

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
      {
        method: 'PUT',
        headers: {
          Authorization: `OAuth ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating content:', error);
      throw new Error('Failed to create content');
    }

    return { status: 'Content created' };
  }

  @Post('create-template')
  async createTemplate(@Body() body: any): Promise<any> {
    const { access_token, dc, name, html, folder_id } = body;

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/templates`,
      {
        method: 'POST',
        headers: {
          Authorization: `OAuth ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          html: html,
          // folder_id: folder_id,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }

    const data = await response.json();
    const template_id = data.id;

    if (!template_id) {
      console.error('No template ID in response:', data);
      throw new Error('No template ID in response');
    }

    console.log(template_id);
    return { template_id };
  }
}
