import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const section = request.nextUrl.searchParams.get("section");

    if (!section) {
      // Get all settings
      const settings = await prisma.setting.findMany({
        where: { key: { startsWith: "content_settings_" } },
      });

      const result: Record<string, any> = {};
      settings.forEach((setting) => {
        const sectionKey = setting.key.replace("content_settings_", "");
        result[sectionKey] = JSON.parse(setting.value);
      });

      return NextResponse.json(result);
    }

    // Get specific section
    const settingsKey = `content_settings_${section}`;
    const setting = await prisma.setting.findUnique({
      where: { key: settingsKey },
    });

    if (!setting) {
      return NextResponse.json({});
    }

    return NextResponse.json(JSON.parse(setting.value));
  } catch (error) {
    console.error("Error getting settings:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
