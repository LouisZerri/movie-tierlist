<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\TierListRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;

#[ORM\Entity(repositoryClass: TierListRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(),
        new Patch(),
        new Delete()
    ],
    normalizationContext: ['groups' => ['tierlist:read']],
    denormalizationContext: ['groups' => ['tierlist:write']]
)]
#[ApiFilter(OrderFilter::class, properties: ['position' => 'ASC'])]
class TierList
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tierlist:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    #[Groups(['tierlist:read', 'tierlist:write'])]
    private ?int $year = null;

    #[ORM\Column(length: 255)]
    #[Groups(['tierlist:read', 'tierlist:write'])]
    private ?string $tier = null;

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    #[Groups(['tierlist:read', 'tierlist:write'])]
    private int $position = 0;

    #[ORM\ManyToOne(inversedBy: 'tierMovie')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tierlist:read', 'tierlist:write'])]
    private ?Movie $movie = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(int $year): static
    {
        $this->year = $year;
        return $this;
    }

    public function getTier(): ?string
    {
        return $this->tier;
    }

    public function setTier(string $tier): static
    {
        $this->tier = $tier;
        return $this;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): static
    {
        $this->position = $position;
        return $this;
    }

    public function getMovie(): ?Movie
    {
        return $this->movie;
    }

    public function setMovie(?Movie $movie): static
    {
        $this->movie = $movie;
        return $this;
    }
}
