// Centralized FormSubmit integration for all site forms.
// Submissions are sent to vaibhav2176a@gmail.com via the AJAX endpoint,
// which keeps the user on-site so we can show a custom thank-you page.

export const FORMSUBMIT_EMAIL = "vaibhav2176a@gmail.com";
export const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;
export const FORMSUBMIT_SUBJECT = "New Rays Academy Enquiry";

export interface FormSubmitPayload {
  /** Source form name, e.g. "Contact Form", "Course Enquiry" */
  formType: string;
  /** Any fields collected from the user */
  [key: string]: string | number | undefined;
}

/**
 * POST a form payload to FormSubmit. Returns true on success.
 * Throws on network failure so callers can show an error state.
 */
export async function submitToFormSubmit(payload: FormSubmitPayload): Promise<boolean> {
  const body = {
    _subject: FORMSUBMIT_SUBJECT,
    _template: "table",
    _captcha: "false",
    _source: typeof window !== "undefined" ? window.location.href : "",
    ...payload,
  };

  const res = await fetch(FORMSUBMIT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`FormSubmit failed with status ${res.status}`);
  }

  const data = await res.json().catch(() => ({}));
  // FormSubmit returns { success: "true", message: "..." } on success
  return data?.success === "true" || data?.success === true;
}
