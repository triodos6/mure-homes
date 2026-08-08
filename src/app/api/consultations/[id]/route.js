import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';

// GET single consultation
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const consultation = await prisma.consultation.findUnique({ where: { id } });
    if (!consultation) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(consultation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// PATCH — update status or invoice info
export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const body = await request.json();
    const updated = await prisma.consultation.update({
      where: { id },
      data: body
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// POST — upload invoice URL + optionally email it
export async function POST(request, { params }) {
  const { id } = await params;
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { invoiceUrl, sendEmail } = await request.json();

    if (!invoiceUrl) return NextResponse.json({ error: 'No invoice URL provided' }, { status: 400 });

    // Save invoice URL to DB
    const consultation = await prisma.consultation.update({
      where: { id },
      data: { 
        invoiceUrl,
        invoiceShared: sendEmail ? true : false,
        status: sendEmail ? 'contacted' : undefined
      }
    });

    const emailPass = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
    const emailUser = process.env.EMAIL_USER || 'info@mura-homes.com';

    // Send email if requested
    if (sendEmail && emailUser && emailPass) {
      const emailPort = parseInt(process.env.EMAIL_PORT || '465', 10);
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'mail.privateemail.com',
        port: isNaN(emailPort) ? 465 : emailPort,
        secure: emailPort === 465,
        auth: { user: emailUser, pass: emailPass },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 15000,
      });

      const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
      const orderNum = id.slice(-8).toUpperCase();

      const emailHtml = `
        <div style="font-family: 'Times New Roman', Times, serif; color: #1a1a1a; max-width: 620px; margin: 0 auto; background-color: #fcfbf9; border: 1px solid #e5e5e5;">
          
          <div style="background-color: #0a0a0a; padding: 36px 40px; text-align: center;">
            <h1 style="color: #fff; font-size: 22px; font-weight: normal; letter-spacing: 6px; text-transform: uppercase; margin: 0;">MuraHomes</h1>
            <p style="color: #888; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin: 8px 0 0;">Invoice Ready — Order #${orderNum}</p>
          </div>

          <div style="padding: 40px;">
            <p style="font-size: 17px; margin: 0 0 16px;">Dear ${consultation.customerName},</p>
            
            <p style="font-size: 14px; line-height: 1.7; color: #333; margin: 0 0 20px;">
              Your invoice for order <strong>#${orderNum}</strong> is now ready. You can find it attached to this email and also accessible through the button below.
            </p>

            <div style="background-color: #f4f2ed; border-left: 3px solid #0a0a0a; padding: 18px 22px; margin-bottom: 28px;">
              <h4 style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px; color: #0a0a0a;">Important details about your order:</h4>
              <p style="font-size: 13px; line-height: 1.6; color: #444; margin: 0 0 12px;">
                <strong>Payment method:</strong> Payment is made via bank transfer, and all the necessary details to complete it are inside the attached invoice.
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #444; margin: 0;">
                <strong>Shipping:</strong> The shipment will begin once we receive confirmation of the payment. Please send us a copy of the transfer receipt so we can proceed with the shipment as soon as possible.
              </p>
            </div>

            <!-- Invoice Summary -->
            <h3 style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; margin: 0 0 16px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tbody>
                ${Array.isArray(consultation.items) ? consultation.items.map(item => `
                  <tr style="border-bottom: 1px solid #efefef;">
                    <td style="padding: 12px 0;">
                      <strong style="font-size: 14px; font-weight: normal;">${item.name}</strong>
                      <span style="font-size: 11px; color: #888; display: block;">Qty: ${item.quantity}</span>
                    </td>
                    <td style="padding: 12px 0; text-align: right; font-size: 14px;">${formatPrice(item.price * item.quantity)}</td>
                  </tr>
                `).join('') : ''}
              </tbody>
            </table>
            
            <div style="text-align: right; border-top: 2px solid #1a1a1a; padding-top: 14px; margin-bottom: 36px;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin: 0 0 4px;">Total Amount</p>
              <p style="font-size: 26px; font-weight: bold; margin: 0;">${formatPrice(consultation.totalPrice)}</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${invoiceUrl}" 
                style="display: inline-block; background-color: #0a0a0a; color: #fff; padding: 16px 40px; text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: bold;">
                Download Invoice
              </a>
            </div>

            <p style="font-size: 12px; color: #888; font-style: italic; text-align: center;">
              If you have any questions, please contact us at info@mura-homes.com
            </p>
          </div>

          <div style="background-color: #0a0a0a; color: #888; padding: 24px 40px; text-align: center;">
            <p style="font-size: 11px; margin: 0; letter-spacing: 2px; text-transform: uppercase; color: #fff;">MuraHomes</p>
            <p style="font-size: 10px; margin: 6px 0 0; color: #666;">Bo. Txiki-Erdi, 7, 20170 Usurbil, Gipuzkoa, España</p>
            <p style="font-size: 10px; margin: 4px 0 0; color: #555;">info@mura-homes.com | +34 627 080 811</p>
          </div>
        </div>
      `;

      // Build attachment array if valid invoice URL/path exists
      const attachments = [];
      if (invoiceUrl) {
        let filename = `Invoice_${orderNum}.pdf`;
        const lowerUrl = invoiceUrl.toLowerCase();
        if (lowerUrl.includes('.pdf')) {
          filename = `Invoice_${orderNum}.pdf`;
        } else if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg')) {
          filename = `Invoice_${orderNum}.jpg`;
        } else if (lowerUrl.includes('.png')) {
          filename = `Invoice_${orderNum}.png`;
        }

        if (invoiceUrl.startsWith('http://') || invoiceUrl.startsWith('https://')) {
          try {
            const fileRes = await fetch(invoiceUrl);
            if (fileRes.ok) {
              const arrayBuffer = await fileRes.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              attachments.push({
                filename: filename,
                content: buffer,
              });
            } else {
              console.warn('Could not download remote invoice for attachment, status:', fileRes.status);
            }
          } catch (fetchErr) {
            console.error('Error fetching remote invoice file for attachment:', fetchErr.message);
          }
        } else {
          attachments.push({
            filename: filename,
            path: invoiceUrl,
          });
        }
      }

      try {
        await transporter.sendMail({
          from: `"MuraHomes" <${emailUser}>`,
          to: consultation.customerEmail,
          subject: `Your Invoice #${orderNum} is Ready | MuraHomes`,
          html: emailHtml,
          attachments,
        });
      } catch (mailError) {
        console.error('Nodemailer Error sending invoice:', mailError.message || mailError);
        return NextResponse.json({ 
          success: true, 
          consultation, 
          emailSent: false, 
          emailError: mailError.message || 'Mail server connection timeout' 
        });
      }
    }

    return NextResponse.json({ success: true, consultation });
  } catch (error) {
    console.error('Invoice Error:', error);
    return NextResponse.json({ error: 'Failed to process invoice' }, { status: 500 });
  }
}
