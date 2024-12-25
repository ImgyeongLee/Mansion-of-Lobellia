import { CharacterBoard } from '@/app/_components/boards';
import { CharacterCreationForm } from '@/app/_components/forms';

export default async function CharactersPage() {
    return (
        <div>
            <h1>Characters</h1>
            <CharacterBoard />
            <CharacterCreationForm />
        </div>
    );
}
