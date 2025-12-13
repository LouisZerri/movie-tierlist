<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\MovieYearsController;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'MovieYear',
    operations: [
        new GetCollection(
            uriTemplate: '/movies/years',
            controller: MovieYearsController::class,
            read: false,
            name: 'get_movie_years',
            normalizationContext: ['groups' => ['year:list']]
        )
    ],
    normalizationContext: ['groups' => ['year:list']]
)]
class MovieYearList
{
    #[Groups(['year:list'])]
    public ?int $year = null;
}


