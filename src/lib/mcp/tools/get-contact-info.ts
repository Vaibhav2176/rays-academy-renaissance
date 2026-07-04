import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact_info",
  title: "Get contact info",
  description: "Return Rays Academy Bhopal contact details: phone, WhatsApp, Instagram, address, and website.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            name: "Rays Academy Bhopal",
            established: 2006,
            phone: "+91 7024057876",
            whatsapp: "+91 7024057876",
            instagram: "@raysacademybhopal",
            address: "Gufa Mandir Road, Lalghati, Bhopal, Madhya Pradesh",
            website: "https://www.raysacademybhopal.in/",
          },
          null,
          2,
        ),
      },
    ],
  }),
});
