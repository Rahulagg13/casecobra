import { db } from "@/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import OrderReceivedEmail from "@/components/email/OrderReceivedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        shippingAddress: {
          create: {
            name: "John Doe",
            city: "Springfield",
            country: "USA",
            postalCode: "62704",
            street: "1234 Elm Street",
            state: "IL",
            phoneNumber: "9876543210",
          },
        },
        billingAddress: {
          create: {
            name: "John Doe",
            city: "Springfield",
            country: "USA",
            postalCode: "62704",
            street: "1234 Elm Street",
            state: "IL",
            phoneNumber: "9876543210",
          },
        },
      },
      include: {
        user: true,
        shippingAddress: true,
      },
    });
    if (!order || !order.user?.email) {
      return NextResponse.json(
        { message: "Order or user not found", ok: false },
        { status: 404 }
      );
    }


     await resend.emails.send({
      from: "CaseCobra <onboarding@resend.dev>",
      to: order!.user.email,
      subject: "Thanks for your order!",
      react: OrderReceivedEmail({
        orderId,
        orderDate: order!.createdAt.toLocaleDateString(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        shippingAddress: {
          name: order.shippingAddress!.name,
          city: order.shippingAddress!.city,
          country: order.shippingAddress!.country,
          postalCode: order.shippingAddress!.postalCode,
          street: order.shippingAddress!.street,
          state: order.shippingAddress!.state,
          phoneNumber: order.shippingAddress!.phoneNumber,
        },
      }),
    });
    return NextResponse.json({
      message: "Your payment was successful!",
      ok: true,
    });
  } catch (err) {

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
