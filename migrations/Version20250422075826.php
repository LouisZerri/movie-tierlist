<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250422075826 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE movie (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, year INT NOT NULL, director VARCHAR(255) NOT NULL, imdb_url VARCHAR(255) NOT NULL, poster VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE tier_list (id INT AUTO_INCREMENT NOT NULL, movie_id INT NOT NULL, year INT NOT NULL, tier VARCHAR(255) NOT NULL, INDEX IDX_C4498D718F93B6FC (movie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE tier_list ADD CONSTRAINT FK_C4498D718F93B6FC FOREIGN KEY (movie_id) REFERENCES movie (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE tier_list DROP FOREIGN KEY FK_C4498D718F93B6FC
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE movie
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE tier_list
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
    }
}
