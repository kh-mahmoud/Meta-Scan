import { countries } from '@/constants';
import { Id } from '@/convex/_generated/dataModel';
import { DataModel } from '@/convex/_generated/dataModel';

export type Country = typeof countries[number]["code"];

export type scrapeProps = {
  prompt: string;
  country?: Country ;
  reportId?:Id<'reports'>;
};

export type CountrySelectorProps = {
  value: string;
  onValueChange: (value: Country) => void;
  disabled?: boolean;
}

export type RetryAnalysisResult = {
  ok: boolean;
  message: string;
};

export type ScrapingDataItem = {
  prompt: string;
  answer_text: string;
  sources: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  timestamp: string;
  url: string;
}

export type Report = DataModel["reports"]["document"]; 