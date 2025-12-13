<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\MovieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: MovieRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Delete()
    ]
)]
class Movie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tierlist:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(
        message: 'Le titre ne peux pas être vide'
    )]
    #[Assert\Length(
        min: 2,
        max: 50,
        minMessage: 'Le titre doit être plus long',
        maxMessage: 'Le titre est trop long'
    )]
    #[Groups(['tierlist:read'])]
    private ?string $title = null;

    #[ORM\Column]
    #[Assert\Range(
        min: 1900,
        max: 2100,
        notInRangeMessage: 'L\'année doit être comprise entre {{ min }} et {{ max }}'
    )]
    #[Assert\NotBlank(
        message: 'L\'année ne peut pas être vide'
    )]
    #[ApiFilter(SearchFilter::class, strategy: 'exact')]
    #[Groups(['tierlist:read'])]
    private ?int $year = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(
        message: 'Le nom du réalisateur ne pas être vide'
    )]
    #[Assert\Length(
        min: 2,
        max: 50,
        minMessage: 'Le nom du réalisateur doit être plus long',
        maxMessage: 'Le nom du réalisateur est trop long'
    )]
    #[Groups(['tierlist:read'])]
    private ?string $director = null;



    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(
        message: 'L\'URL Imdb ne peux pas être vide'
    )]
    #[Assert\Length(
        min: 2,
        max: 200,
        minMessage: 'L\'URL Imdb doit être plus longue',
        maxMessage: 'L\'URL Imdb est trop longue'
    )]
    #[Groups(['tierlist:read'])]
    private ?string $imdbUrl = null;


    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(
        message: 'L\'URL de l\'affiche du film ne peut pas etre vide'
    )]
    #[Groups(['tierlist:read'])]
    private ?string $poster = null;

    /**
     * @var Collection<int, TierList>
     */
    #[ORM\OneToMany(targetEntity: TierList::class, mappedBy: 'movie', orphanRemoval: true)]
    private Collection $tierMovie;

    public function __construct()
    {
        $this->tierMovie = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
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

    public function getDirector(): ?string
    {
        return $this->director;
    }

    public function setDirector(string $director): static
    {
        $this->director = $director;

        return $this;
    }

    public function getImdbUrl(): ?string
    {
        return $this->imdbUrl;
    }

    public function setImdbUrl(?string $imdbUrl): static
    {
        $this->imdbUrl = $imdbUrl;

        return $this;
    }

    public function getPoster(): ?string
    {
        return $this->poster;
    }

    public function setPoster(string $poster): static
    {
        $this->poster = $poster;

        return $this;
    }

    /**
     * @return Collection<int, TierList>
     */
    public function getTierMovie(): Collection
    {
        return $this->tierMovie;
    }

    public function addTierMovie(TierList $tierMovie): static
    {
        if (!$this->tierMovie->contains($tierMovie)) {
            $this->tierMovie->add($tierMovie);
            $tierMovie->setMovie($this);
        }

        return $this;
    }

    public function removeTierMovie(TierList $tierMovie): static
    {
        if ($this->tierMovie->removeElement($tierMovie)) {
            // set the owning side to null (unless already changed)
            if ($tierMovie->getMovie() === $this) {
                $tierMovie->setMovie(null);
            }
        }

        return $this;
    }
}
