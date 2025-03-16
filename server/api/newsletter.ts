import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const subscribeHandler = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { email } = subscribeSchema.parse(req.body);

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter.',
      });
    }

    // Create new subscriber
    await prisma.newsletter.create({
      data: {
        email,
        subscribedAt: new Date(),
        status: 'ACTIVE',
      },
    });

    // Send welcome email (you can implement this later)
    // await sendWelcomeEmail(email);

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your subscription.',
    });
  }
}; 