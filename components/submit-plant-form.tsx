import { CheckCircle2 } from "lucide-react";
import { createPlantAction } from "@/lib/actions";

type SubmitPlantFormProps = {
  error?: string;
  message?: string;
};

export function SubmitPlantForm({ error, message }: SubmitPlantFormProps) {
  return (
    <div className="panel rounded-[32px] p-6 md:p-8">
      <p className="eyebrow">Submit a Plant</p>
      <h1 className="title-page mt-3">Place your plant discovery on the map</h1>
      <p className="text-subtle mt-3 max-w-2xl">
        Upload a photo, add the plant name, description, coordinates, and tags. New submissions enter review first,
        then appear on the homepage map after approval.
      </p>

      <form action={createPlantAction} className="mt-8 grid gap-4 md:grid-cols-2">
        <input className="field" name="name" placeholder="Plant name" required />
        <input className="field" name="tags" placeholder="Tags, separated by commas" />
        <textarea
          className="field md:col-span-2"
          name="description"
          rows={5}
          placeholder="Describe the plant, its setting, or the story behind your discovery..."
          required
        />
        <input className="field" name="latitude" type="number" step="any" placeholder="Latitude" required />
        <input className="field" name="longitude" type="number" step="any" placeholder="Longitude" required />
        <input className="field md:col-span-2" name="image" type="file" accept="image/*" />
        <button className="btn btn-primary md:col-span-2 md:w-fit" type="submit">
          Submit for Review
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <div className="mt-5 rounded-[24px] border border-emerald-200 bg-[linear-gradient(135deg,rgba(235,248,232,0.96),rgba(248,252,246,0.9))] p-5 text-emerald-800 shadow-[0_12px_30px_rgba(31,51,29,0.05)]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold">Submission received and sent to review</p>
              <p className="text-subtle mt-2 text-emerald-700/90">
                {message} Once approved, this plant will appear on the homepage map.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
