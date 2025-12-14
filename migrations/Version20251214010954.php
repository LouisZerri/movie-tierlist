<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251214010954 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add position column to tier_list and set initial positions';
    }

    public function up(Schema $schema): void
    {
        // Ajoute la colonne
        $this->addSql('ALTER TABLE tier_list ADD position INT DEFAULT 0 NOT NULL');

        // Met à jour les positions par groupe (year, tier) en fonction de l'id
        $this->addSql('
            UPDATE tier_list t1
            JOIN (
                SELECT id, 
                       ROW_NUMBER() OVER (PARTITION BY year, tier ORDER BY id) - 1 AS new_position
                FROM tier_list
            ) t2 ON t1.id = t2.id
            SET t1.position = t2.new_position
        ');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE tier_list DROP position
        SQL);
    }
}
