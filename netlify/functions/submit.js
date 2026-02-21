const { google } = require("googleapis");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT || !process.env.SHEET_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing environment variables" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();

    const sheets = google.sheets({
      version: "v4",
      auth: client,
    });

    const row = [
      new Date().toISOString(),
      body.patient_no || "",
      body.age || "",
      body.gender || "",
      body.region || "",
      body.heard_hpv || "",
      Array.isArray(body.source) ? body.source.join(", ") : body.source || "",
      body.when_heard || "",
      body.hpv_knowledge || "",
      body.offered_vaccine_self || "",
      body.offered_vaccine_family || "",
      body.know_vaccinated || "",
      body.vaccine_info || "",
      body.refusal_reason || "",
      body.hpv_cancer_relation || "",
      body.which_cancer || "",
      body.head_neck_cancer || "",
      body.aware_head_neck_source || "",
      body.aware_head_neck_age || "",
      body.aware_symptoms || "",
      body.affected_group_route || "",
      body.affected_part || "",
      body.prevention_methods || "",
      body.prevention_details || "",
      body.public_info || "",
      body.gov_awareness || "",
      body.more_informed || "",
      body.curious || "",
      body.prevent_virus || "",
      body.cervical_vaccine || "",
      body.prevent_head_neck || "",
      body.vaccinated_group || "",
      body.vaccinate_boys || "",
      body.nhs_support || "",
      body.take_vaccine || "",
      body.recommend_family || "",
      body.vaccination_status || "",
      body.other_comments || "",
      body.public_support || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [row],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Survey stored successfully" }),
    };
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Internal Server Error",
      }),
    };
  }
};
