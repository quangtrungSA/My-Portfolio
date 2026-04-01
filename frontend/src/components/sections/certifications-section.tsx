"use client";

import { motion } from "motion/react";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Certification } from "@/types";

interface CertificationsSectionProps {
  certifications: Certification[];
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM yyyy");
}

export function CertificationsSection({
  certifications,
}: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Certifications"
          subtitle="Professional certifications and credentials I have earned."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    {cert.badgeUrl ? (
                      <img
                        src={cert.badgeUrl}
                        alt={`${cert.name} badge`}
                        className="size-12 shrink-0 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Award className="size-6 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base leading-tight">
                        {cert.name}
                      </CardTitle>
                      <p className="mt-1 text-sm font-medium text-primary">
                        {cert.issuingOrg}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      <span>Issued {formatDate(cert.issueDate)}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cert.expiryDate
                        ? `Expires ${formatDate(cert.expiryDate)}`
                        : "No Expiry"}
                    </Badge>
                  </div>

                  {cert.credentialId && (
                    <p className="text-xs text-muted-foreground">
                      Credential ID: {cert.credentialId}
                    </p>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
                    >
                      <ExternalLink className="size-3" />
                      View Credential
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
