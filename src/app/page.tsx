import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Spinner } from "@/components/ui/Spinner";

export default function Home() {
  return (
    <main className="w-full max-w-md p-6">
      <Card>
        <Heading className="mb-4">Meu Design System</Heading>
        <Input placeholder="Digite algo..." />
        <div className="flex items-center gap-2 mt-4">
          <Button variant="primary">Salvar</Button>
          <Button variant="secondary">Cancelar</Button>
          <Button variant="danger">Excluir</Button>
          <Spinner />
        </div>
      </Card>
    </main>
  );
}
