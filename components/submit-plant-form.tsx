import { createPlantAction } from "@/lib/actions";

type SubmitPlantFormProps = {
  error?: string;
  message?: string;
};

export function SubmitPlantForm({ error, message }: SubmitPlantFormProps) {
  return (
    <div className="panel rounded-[32px] p-6 md:p-8">
      <h1 className="text-3xl font-semibold">提交植物</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
        上传你发现的植物图片，填写名称、描述、经纬度和标签。提交后状态会先进入
        `pending`，等待管理员审核。
      </p>

      <form action={createPlantAction} className="mt-8 grid gap-4 md:grid-cols-2">
        <input className="field" name="name" placeholder="植物名称" required />
        <input className="field" name="tags" placeholder="标签，用英文逗号分隔" />
        <textarea
          className="field md:col-span-2"
          name="description"
          rows={5}
          placeholder="描述植物特征、生长环境、发现故事..."
          required
        />
        <input className="field" name="latitude" type="number" step="any" placeholder="纬度" required />
        <input className="field" name="longitude" type="number" step="any" placeholder="经度" required />
        <input className="field md:col-span-2" name="image" type="file" accept="image/*" />
        <button className="btn btn-primary md:col-span-2 md:w-fit" type="submit">
          提交审核
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
