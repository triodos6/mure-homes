import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { cart, name, email, phone, address, city, state, pinCode, password } = await request.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!email || !address || !state || !pinCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create user account or verify existing
    const existingUser = await prisma.user.findUnique({ where: { email } });
    let accountCreated = false;
    if (!existingUser) {
      // New user — create account with provided password
      if (!password) {
        return NextResponse.json({ error: 'Se requiere una contraseña para crear tu cuenta' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const nameParts = (name || '').trim().split(' ');
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: nameParts[0] || null,
          lastName: nameParts.slice(1).join(' ') || null,
          phone: phone || null,
          role: 'USER',
        },
      });
      accountCreated = true;
    } else if (password) {
      // Existing user — verify their password
      if (existingUser.password) {
        const valid = await bcrypt.compare(password, existingUser.password);
        if (!valid) {
          return NextResponse.json({ error: 'Contraseña incorrecta. Por favor, intenta de nuevo.' }, { status: 401 });
        }
      }
      // If they have no password set (legacy / social account), skip verification
    }

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const savedInquiry = await prisma.consultation.create({
      data: {
        customerName: name || 'Valued Client',
        customerEmail: email,
        customerPhone: phone || null,
        address,
        city: city || null,
        state,
        pinCode,
        totalPrice: cartTotal,
        items: cart,
        status: 'pending',
      }
    });

    const emailPass = process.env.EMAIL_APP_PASSWORD;

    if (!process.env.EMAIL_USER || !emailPass) {
      console.warn('Email credentials missing. Order saved but email skipped.');
      return NextResponse.json({ success: true, inquiryId: savedInquiry.id, accountCreated, emailSent: false });
    }

    const emailPort = parseInt(process.env.EMAIL_PORT || '465', 10);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'mail.privateemail.com',
      port: isNaN(emailPort) ? 465 : emailPort,
      secure: emailPort === 465,
      auth: { user: process.env.EMAIL_USER, pass: emailPass },
    });

    const formatPrice = (price) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);

    const emailHtml = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #1a1a1a; max-width: 620px; margin: 0 auto; background-color: #fcfbf9; border: 1px solid #e5e5e5;">
        <div style="background-color: #0a0a0a; padding: 36px 40px; text-align: center;">
          <h1 style="color: #fff; font-size: 22px; font-weight: normal; letter-spacing: 6px; text-transform: uppercase; margin: 0;">MuraHomes</h1>
          <p style="color: #888; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin: 8px 0 0;">Confirmación de Pedido #${savedInquiry.id.slice(-8).toUpperCase()}</p>
        </div>
        <div style="padding: 40px;">
          <p style="font-size: 17px; margin: 0 0 8px;">Estimado/a ${name},</p>
          <p style="font-size: 14px; line-height: 1.7; color: #555; margin: 0 0 32px;">
            Confirmamos que tu pedido ya está con nosotros.<br/><br/>
            Muchas gracias por confiar en Mura Homes para formar parte de tu hogar. En breve, recibirás un correo electrónico con todos los detalles de tu compra y los pasos a seguir para realizar el pago.<br/><br/>
            Estamos a tu disposición para cualquier duda.
          </p>
          <h3 style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; margin: 0 0 16px;">Tu Selección</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tbody>
              ${cart.map(item => `
                <tr style="border-bottom: 1px solid #efefef;">
                  <td style="padding: 14px 0;">
                    <strong style="font-size: 15px; font-weight: normal;">${item.name}</strong>
                    <span style="font-size: 11px; color: #888; display: block; margin-top: 3px;">${item.brand} | Cant: ${item.quantity}</span>
                  </td>
                  <td style="padding: 14px 0; text-align: right; font-size: 15px;">${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="text-align: right; border-top: 2px solid #1a1a1a; padding-top: 16px; margin-bottom: 32px;">
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin: 0 0 4px;">Total del Pedido</p>
            <p style="font-size: 26px; font-weight: bold; margin: 0;">${formatPrice(cartTotal)}</p>
          </div>
          <h3 style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px; margin: 0 0 16px;">Datos de Entrega</h3>
          <table style="width: 100%; font-size: 13px; color: #444; margin-bottom: 32px;">
            <tr><td style="padding: 5px 0; color: #888; width: 120px;">Dirección</td><td>${address}${city ? ', ' + city : ''}</td></tr>
            <tr><td style="padding: 5px 0; color: #888;">Provincia</td><td>${state}</td></tr>
            <tr><td style="padding: 5px 0; color: #888;">Código Postal</td><td>${pinCode}</td></tr>
            ${phone ? `<tr><td style="padding: 5px 0; color: #888;">Teléfono</td><td>${phone}</td></tr>` : ''}
          </table>
        </div>
        <div style="background-color: #0a0a0a; color: #888; padding: 24px 40px; text-align: center;">
          <p style="font-size: 11px; margin: 0; letter-spacing: 2px; text-transform: uppercase; color: #fff;">MuraHomes</p>
          <p style="font-size: 10px; margin: 6px 0 0; color: #666;">Bo. Txiki-Erdi, 7, 20170 Usurbil, Gipuzkoa, España</p>
          <p style="font-size: 10px; margin: 4px 0 0; color: #555;">info@mura-homes.com | +34 627 080 811</p>
        </div>
      </div>
    `;

    let emailSent = false;
    try {
      await transporter.verify();
      const recipients = [email];
      if (process.env.EMAIL_USER && process.env.EMAIL_USER !== email) {
        recipients.push(process.env.EMAIL_USER);
      }
      await transporter.sendMail({
        from: `"MuraHomes" <${process.env.EMAIL_USER}>`,
        to: recipients,
        subject: `Confirmación de Pedido #${savedInquiry.id.slice(-8).toUpperCase()} | MuraHomes`,
        html: emailHtml,
      });
      emailSent = true;
    } catch (mailError) {
      console.error('Nodemailer Error sending checkout confirmation:', mailError.message || mailError);
    }

    return NextResponse.json({
      success: true,
      message: emailSent ? 'Order placed and confirmation sent.' : 'Order placed but email delivery failed.',
      inquiryId: savedInquiry.id,
      accountCreated,
      emailSent,
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'System error during checkout' }, { status: 500 });
  }
}
